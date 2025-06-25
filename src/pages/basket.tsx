import {CheckIcon, ClockIcon, QuestionMarkCircleIcon} from '@heroicons/react/20/solid';
import {useBasket} from '@/context/Basket';
import {useEffect, useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router';

export default function Page() {
    const {products} = useBasket();
    const router = useRouter();
    const [total, setTotal] = useState<number>(0);

    useEffect(() => {
        if (products.length === 0) {
            router.push('/');
        } else {
            setTotal(products.reduce((t, p) => t + p.price, 0));
        }
    }, [products]);

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Shopping Cart</h1>
                <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
                    <section aria-labelledby="cart-heading" className="lg:col-span-7">
                        <h2 id="cart-heading" className="sr-only">
                            Items in your shopping cart
                        </h2>

                        <ul role="list" className="divide-y divide-gray-200 border-t border-b border-gray-200">
                            {products.map((product) => (
                                <li key={product.id} className="flex py-6 sm:py-10">
                                    <div className="shrink-0">
                                        <img
                                            alt={product.imageAlt}
                                            src={product.imageSrc}
                                            className="size-24 rounded-md object-cover sm:size-48"
                                        />
                                    </div>

                                    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                                        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                            <div>
                                                <div className="flex justify-between">
                                                    <h3 className="text-sm">
                                                        <Link href={`/${product.id}`}
                                                              className="font-medium text-gray-700 hover:text-gray-800">
                                                            {product.name}
                                                        </Link>
                                                    </h3>
                                                </div>
                                                <div className="mt-1 flex flex-col text-sm">
                                                    <p className="text-gray-500">Color: {product.color}</p>
                                                    <p className="border-t border-gray-200 text-gray-500">Size: {product.size}</p>
                                                    {product.draft ? (
                                                        <p className="border-t border-gray-200 text-gray-500">Draft: {product.draft}</p>
                                                    ) : null}
                                                </div>
                                                <p className="mt-1 text-sm font-medium text-gray-900">{product.price}</p>
                                            </div>
                                        </div>

                                        <p className="mt-4 flex space-x-2 text-sm text-gray-700">
                                            {product.inStock ? (
                                                <CheckIcon aria-hidden="true"
                                                           className="size-5 shrink-0 text-green-500"/>
                                            ) : (
                                                <ClockIcon aria-hidden="true"
                                                           className="size-5 shrink-0 text-gray-300"/>
                                            )}

                                            <span>In stock</span>
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Order summary */}
                    <section
                        aria-labelledby="summary-heading"
                        className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
                    >
                        <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
                            Order summary
                        </h2>

                        <dl className="mt-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <dt className="text-sm text-gray-600">Subtotal</dt>
                                <dd className="text-sm font-medium text-gray-900">${(total - (total * 0.19)).toFixed(2)}</dd>
                            </div>
                            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                <dt className="flex items-center text-sm text-gray-600">
                                    <span>Shipping estimate</span>
                                    <a href="#" className="ml-2 shrink-0 text-gray-400 hover:text-gray-500">
                                        <span className="sr-only">Learn more about how shipping is calculated</span>
                                        <QuestionMarkCircleIcon aria-hidden="true" className="size-5"/>
                                    </a>
                                </dt>
                                <dd className="text-sm font-medium text-gray-900">$5.00</dd>
                            </div>
                            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                <dt className="flex text-sm text-gray-600">
                                    <span>Tax estimate</span>
                                    <a href="#" className="ml-2 shrink-0 text-gray-400 hover:text-gray-500">
                                        <span className="sr-only">Learn more about how tax is calculated</span>
                                        <QuestionMarkCircleIcon aria-hidden="true" className="size-5"/>
                                    </a>
                                </dt>
                                <dd className="text-sm font-medium text-gray-900">${(total * 0.19).toFixed(2)}</dd>
                            </div>
                            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                <dt className="text-base font-medium text-gray-900">Order total</dt>
                                <dd className="text-base font-medium text-gray-900">${(total + 5).toFixed(2)}</dd>
                            </div>
                        </dl>

                        <div className="mt-6">
                            <button
                                type="submit"
                                className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-xs hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-hidden"
                            >
                                Checkout
                            </button>
                        </div>
                    </section>
                </form>
            </div>
        </div>
    );
}
