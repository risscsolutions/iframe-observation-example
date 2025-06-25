import {
    Dialog, DialogBackdrop, DialogPanel,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
} from '@headlessui/react';
import {StarIcon} from '@heroicons/react/20/solid';
import {HeartIcon, MinusIcon, PlusIcon} from '@heroicons/react/24/outline';
import {FormEvent, MouseEvent, useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/router';
import {useBasket} from '@/context/Basket';

const product = {
    id: 1,
    name: 'Zip Tote Basket',
    price: 140,
    rating: 4,
    images: [
        {
            id: 1,
            name: 'Angled view',
            src: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-03-product-01.jpg',
            alt: 'Angled front view with bag zipped and handles upright.',
        },
        // More images...
    ],
    colors: [
        {id: 'washed-black', name: 'Washed Black', classes: 'bg-gray-700 checked:outline-gray-700'},
        {id: 'white', name: 'White', classes: 'bg-white checked:outline-gray-400'},
        {id: 'washed-gray', name: 'Washed Gray', classes: 'bg-gray-500 checked:outline-gray-500'},
    ],
    sizes: [
        {id: 'xxs', name: 'xxs'},
        {id: 'xs', name: 'xs'},
        {id: 's', name: 's'},
        {id: 'm', name: 'm'},
        {id: 'l', name: 'l'},
        {id: 'xl', name: 'xl'},
        {id: 'xxl', name: 'xxl'},
    ],
    description: `
    <p>The Zip Tote Basket is the perfect midpoint between shopping tote and comfy backpack. With convertible straps, you can hand carry, should sling, or backpack this convenient and spacious bag. The zip top and durable canvas construction keeps your goods protected for all-day use.</p>
  `,
    details: [
        {
            name: 'Features',
            items: [
                'Multiple strap configurations',
                'Spacious interior with top zip',
                'Leather handle and tabs',
                'Interior dividers',
                'Stainless strap loops',
                'Double stitched construction',
                'Water-resistant',
            ],
        },
        // More sections...
    ],
};

function classNames(...classes: Array<string>) {
    return classes.filter(Boolean).join(' ');
}


export default function Page() {
    const router = useRouter();
    const iframe = useRef<HTMLIFrameElement>(null);
    const {addProduct} = useBasket();
    const [draft, setDraft] = useState<string>();
    const [editorUrl, setEditorUrl] = useState<string>();
    const [open, setOpen] = useState<boolean>(false);
    const [fix, setFix] = useState(0);

    const [color, setColor] = useState('washed-black');
    const [size, setSize] = useState('m');

    function openEditor(e: MouseEvent) {
        e.preventDefault();

        fetch('/api/editor', {
            method: 'POST',
        }).then(async response => {
            const {url, draft} = await response.json();
            setEditorUrl(url);
            setDraft(draft);
            setOpen(true);
        });
    }

    async function deleteDraft() {
        setOpen(false);
        setDraft(undefined);
        setEditorUrl(undefined);
    }

    function onSubmit(e: FormEvent) {
        e.preventDefault();
        if (!draft) return;

        addProduct({
            id: product.id,
            name: product.name,
            draft: draft,
            price: product.price,
            color: color,
            size: size,
            imageSrc: product.images[0].src,
            imageAlt: product.images[0].alt,

            inStock: true
        });
        router.push('/basket');
    }

    function onLoad() {
        try {
            const currentUrl = iframe.current?.contentWindow?.location.href;

            console.error('Iframe loaded:', currentUrl);
            setOpen(false);
            iframe.current = null;

            // Detect when iframe navigates to your POST handler
            if (currentUrl?.includes('/add-to-basket')) {
                // router.push('/basket');
            } else if (currentUrl?.includes('/delete-draft')) {
                deleteDraft();
            }
        } catch (e) {
            // Cross-origin iframe — can't access contentWindow
            console.warn('Still on third-party origin, cannot access iframe content', {e});
        }
    }

    useEffect(() => {
        if (!iframe.current) return;

        const current = iframe.current;
        current.addEventListener('load', onLoad);

        return () => {
            current.removeEventListener('load', onLoad);
        };
    }, [fix]);

    return (
        <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8 min-h-screen">
            <Dialog
                open={open}
                onClose={deleteDraft}
                ref={(node) => {
                    iframe.current = node?.querySelector<HTMLIFrameElement>('iframe#editor-iframe') as HTMLIFrameElement;
                    setFix(fix + 1);
                }}
                className="relative z-10">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                />

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex h-screen items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel
                            transition
                            className="relative h-[85%] transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in w-full m-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                        >
                            <iframe id="editor-iframe" ref={iframe} className="w-full h-full" src={editorUrl}/>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>

            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
                    {/* Image gallery */}
                    <TabGroup className="flex flex-col-reverse">
                        {/* Image selector */}
                        <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
                            <TabList className="grid grid-cols-4 gap-6">
                                {product.images.map((image) => (
                                    <Tab
                                        key={image.id}
                                        className="group relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium text-gray-900 uppercase hover:bg-gray-50 focus:ring-3 focus:ring-indigo-500/50 focus:ring-offset-4 focus:outline-hidden"
                                    >
                                        <span className="sr-only">{image.name}</span>
                                        <span className="absolute inset-0 overflow-hidden rounded-md"><img alt=""
                                                                                                           src={image.src}
                                                                                                           className="size-full object-cover"/></span>
                                        <span
                                            aria-hidden="true"
                                            className="pointer-events-none absolute inset-0 rounded-md ring-2 ring-transparent ring-offset-2 group-data-selected:ring-indigo-500"
                                        />
                                    </Tab>
                                ))}
                            </TabList>
                        </div>

                        <TabPanels>
                            {product.images.map((image) => (
                                <TabPanel key={image.id}>
                                    <img alt={image.alt} src={image.src}
                                         className="aspect-square w-full object-cover sm:rounded-lg"/>
                                </TabPanel>
                            ))}
                        </TabPanels>
                    </TabGroup>

                    {/* Product info */}
                    <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.name}</h1>

                        <div className="mt-3">
                            <h2 className="sr-only">Product information</h2>
                            <p className="text-3xl tracking-tight text-gray-900">${product.price}</p>
                        </div>

                        {/* Reviews */}
                        <div className="mt-3">
                            <h3 className="sr-only">Reviews</h3>
                            <div className="flex items-center">
                                <div className="flex items-center">
                                    {[0, 1, 2, 3, 4].map((rating) => (
                                        <StarIcon
                                            key={rating}
                                            aria-hidden="true"
                                            className={classNames(
                                                product.rating > rating ? 'text-indigo-500' : 'text-gray-300',
                                                'size-5 shrink-0',
                                            )}
                                        />
                                    ))}
                                </div>
                                <p className="sr-only">{product.rating} out of 5 stars</p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="sr-only">Description</h3>

                            <div
                                dangerouslySetInnerHTML={{__html: product.description}}
                                className="space-y-6 text-base text-gray-700"
                            />
                        </div>

                        <form className="mt-6" onSubmit={onSubmit}>
                            {/* Colors */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-600">Color</h3>

                                <fieldset aria-label="Choose a color" className="mt-2">
                                    <div className="flex items-center gap-x-3">
                                        {product.colors.map((color) => (
                                            <div key={color.id}
                                                 className="flex rounded-full outline -outline-offset-1 outline-black/10">
                                                <input
                                                    defaultValue={color.id}
                                                    onClick={() => setColor(color.id)}
                                                    defaultChecked={color === product.colors[0]}
                                                    name="color"
                                                    type="radio"
                                                    aria-label={color.name}
                                                    className={classNames(
                                                        color.classes,
                                                        'size-8 appearance-none rounded-full cursor-pointer forced-color-adjust-none checked:outline-2 checked:outline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-3',
                                                    )}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </fieldset>
                            </div>
                            <div className="mt-5">
                                <h3 className="text-sm font-medium text-gray-600">Size</h3>

                                <fieldset aria-label="Choose a color" className="mt-2">
                                    <div className="flex items-center gap-x-3">
                                        {product.sizes.map((s) => (
                                            <button key={s.id}
                                                    onClick={() => setSize(s.id)}
                                                    className={`${s.id === size ? 'outline-gray-400 outline-2 outline-offset-2' : ''} text-center align-middle block outline -outline-offset-1 outline-black/10 size-8 appearance-none rounded-sm cursor-pointer forced-color-adjust-none focus-visible:outline-3 focus-visible:outline-offset-3 bg-white`}>
                                                {s.name}
                                            </button>
                                        ))}
                                    </div>
                                </fieldset>
                            </div>

                            <div className="mt-10 flex">
                                {draft
                                    ? (<button
                                        type="submit"
                                        className="cursor-pointer flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-hidden sm:w-full"
                                    >
                                        Add to bag
                                    </button>)
                                    : <button
                                        type="button"
                                        onClick={openEditor}
                                        className="cursor-pointer flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-hidden sm:w-full"
                                    >
                                        open Editor
                                    </button>
                                }

                                <button
                                    type="button"
                                    className="ml-4 flex items-center justify-center rounded-md px-3 py-3 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                                >
                                    <HeartIcon aria-hidden="true" className="size-6 shrink-0"/>
                                    <span className="sr-only">Add to favorites</span>
                                </button>
                            </div>
                        </form>

                        <section aria-labelledby="details-heading" className="mt-12">
                            <h2 id="details-heading" className="sr-only">
                                Additional details
                            </h2>

                            <div className="divide-y divide-gray-200 border-t border-gray-200">
                                {product.details.map((detail) => (
                                    <Disclosure key={detail.name} as="div">
                                        <h3>
                                            <DisclosureButton
                                                className="group relative flex w-full items-center justify-between py-6 text-left">
                        <span className="text-sm font-medium text-gray-900 group-data-open:text-indigo-600">
                          {detail.name}
                        </span>
                                                <span className="ml-6 flex items-center">
                          <PlusIcon
                              aria-hidden="true"
                              className="block size-6 text-gray-400 group-hover:text-gray-500 group-data-open:hidden"
                          />
                          <MinusIcon
                              aria-hidden="true"
                              className="hidden size-6 text-indigo-400 group-hover:text-indigo-500 group-data-open:block"
                          />
                        </span>
                                            </DisclosureButton>
                                        </h3>
                                        <DisclosurePanel className="pb-6">
                                            <ul role="list"
                                                className="list-disc space-y-1 pl-5 text-sm/6 text-gray-700 marker:text-gray-300">
                                                {detail.items.map((item) => (
                                                    <li key={item} className="pl-2">
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </DisclosurePanel>
                                    </Disclosure>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
