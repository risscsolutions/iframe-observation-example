import type {NextApiRequest, NextApiResponse} from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    fetch(`${process.env.PRINTFORMER_BASE_URI}/api-ext/draft/${req.query.draft}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${process.env.PRINTFORMER_API_KEY}`
        }
    });
    res.status(200).end();
}
