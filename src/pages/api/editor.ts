import type {NextApiRequest, NextApiResponse} from 'next';
import {JWTPayload, SignJWT} from 'jose';
import crypto from 'node:crypto';

const encoder = new TextEncoder();
const apiKey = encoder.encode(process.env.PRINTFORMER_API_KEY);

function buildQueryString(params: object): string {
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
        if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, v));
        } else {
            searchParams.append(key, value);
        }
    }

    return searchParams.toString();
}

function base64_encode(string: string): string {
    return Buffer.from(string).toString('base64');
}

async function encrypt<T extends JWTPayload>(payload: T) {
    return new SignJWT(payload)
        .setProtectedHeader({
            alg: 'HS256',
            jti: crypto.randomBytes(Math.ceil(16 / 2)).toString('hex').substring(0, 16)
        })
        .setIssuedAt()
        .setExpirationTime('1d')
        .sign(apiKey);
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {

    const createUserResponse = await fetch(`${process.env.PRINTFORMER_BASE_URI}/api-ext/user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${process.env.PRINTFORMER_API_KEY}`
        }
    });
    const userIdentifier = (await createUserResponse.json()).data.identifier;
    const createDraftResponse = await fetch(`${process.env.PRINTFORMER_BASE_URI}/api-ext/draft`, {
        method: 'POST',
        body: JSON.stringify({
            templateIdentifier: process.env.PRINTFORMER_TEMPLATE,
            intent: 'customize',
            userIdentifier
        }),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${process.env.PRINTFORMER_API_KEY}`
        }
    });

    const draft: string = (await createDraftResponse.json()).data.draftHash;

    const token = await encrypt({
        iat: Date.now(),
        user: userIdentifier,
        client: process.env.PRINTFORMER_API_IDENTIFIER,
        redirect: `${process.env.PRINTFORMER_BASE_URI}/editor/${draft}?` + buildQueryString({
            callback: base64_encode(`${process.env.APP_URL}/api/add-to-basket`),
            callback_cancel: base64_encode(`${process.env.APP_URL}/api/delete-draft?` + buildQueryString({draft})),
            callback_target: 'self'
        })
    });

    res.status(201).json({
        draft,
        url: `${process.env.PRINTFORMER_BASE_URI}/auth?` + buildQueryString({jwt: token})
    });
}
