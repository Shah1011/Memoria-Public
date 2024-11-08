import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { collection, query, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '@/app/firebase';
import { Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Delete from './icons/Delete';
import Edit from './icons/Edit';
import Stack from './icons/Stack';
import ImageModal from './ImageModal';
import Favorite from './icons/Favorite';
import { onAuthStateChanged } from 'firebase/auth';
import Loader from './Loader';

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('Authenticated User UID:', user.uid);
  } else {
    console.log('No user is authenticated');
  }
});

interface Item {
    number: string;
    date: string;
    story: string;
    images: File[] | null;
    imageUrls?: string[];
    favorite?: boolean;
    id?: string;
}

const placeholderImage = "https://i.ibb.co/nLGsHWQ/f533b100c0b5d3bef97d4c075f12066a.gif";

const Memory: React.FC = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [newItem, setNewItem] = useState<Item>({ number: '', date: '', story: '', images: null });
    const [modalImages, setModalImages] = useState<string[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [editItemId, setEditItemId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [showFavorites, setShowFavorites] = useState(false);
    const [loading, setLoading] = useState(false);
    const itemsPerPage = 24;
    const formRef = useRef<HTMLFormElement>(null);
    

    useEffect(() => {
        const unsubscribe = onSnapshot(query(collection(db, 'items')), (querySnapshot) => {
            const itemsArr: Item[] = [];
            querySnapshot.forEach((doc) => {
                itemsArr.push({ ...doc.data(), id: doc.id } as Item);
            });
            setItems(itemsArr);
        });

        return () => unsubscribe();
    }, []);

    const addItem = async (e: FormEvent) => {
        e.preventDefault();
    
        if (newItem.number && newItem.date && newItem.story) {
            setLoading(true);
            let imageUrls: string[] = [];
    
            try {
                if (newItem.images && newItem.images.length > 0) {
                    const docRef = editItemId ? doc(db, 'items', editItemId) : await addDoc(collection(db, 'items'), {
                        number: newItem.number.trim(),
                        date: newItem.date,
                        story: newItem.story.trim(),
                        imageUrls: [],
                        favorite: false,
                    });
    
                    const memoryCardId = editItemId || docRef.id;
    
                    imageUrls = await Promise.all(
                        newItem.images.map(async (image) => {
                            const imageRef = ref(storage, `images/${memoryCardId}/${image.name}`);
                            await uploadBytes(imageRef, image);
                            return getDownloadURL(imageRef);
                        })
                    );
    
                    if (editItemId) {
                        await updateDoc(doc(db, 'items', editItemId), {
                            number: newItem.number.trim(),
                            date: newItem.date,
                            story: newItem.story.trim(),
                            imageUrls: imageUrls,
                        });
                        setEditItemId(null);
                    } else {
                        await updateDoc(doc(db, 'items', memoryCardId), {
                            imageUrls: imageUrls
                        });
                    }
                } else {
                    imageUrls.push(placeholderImage);
    
                    if (editItemId) {
                        await updateDoc(doc(db, 'items', editItemId), {
                            number: newItem.number.trim(),
                            date: newItem.date,
                            story: newItem.story.trim(),
                            imageUrls: imageUrls,
                        });
                        setEditItemId(null);
                    } else {
                        const docRef = await addDoc(collection(db, 'items'), {
                            number: newItem.number.trim(),
                            date: newItem.date,
                            story: newItem.story.trim(),
                            imageUrls: imageUrls,
                            favorite: false,
                        });
                    }
                }
    
                setNewItem({ number: '', date: '', story: '', images: null });
                toast.success('Memory added', {
                    position: "bottom-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Slide,
                    });
            } catch (error) {
                console.error("Error adding item:", error);
                toast.error('An unexpected error occurred', {
                    position: "bottom-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Slide,
                });
            } finally {
                setLoading(false);
            }
        } else {
            console.log("Missing fields");
        }
    };

    const deleteItem = async (id: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this memory?");
        if (confirmDelete) {
            await deleteDoc(doc(db, 'items', id));
            setItems(items.filter(item => item.id !== id));
            toast.success('Memory Deleted', {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Slide,
                });
        }
    };

    const toggleFavorite = async (id: string, currentStatus: boolean) => {
        await updateDoc(doc(db, 'items', id), {
            favorite: !currentStatus,
        });
    };

    const openModal = (imageUrls: string[], initialIndex: number = 0) => {
        setModalImages(imageUrls);
        setCurrentImageIndex(initialIndex);
    };

    const closeModal = () => {
        setModalImages([]);
        setCurrentImageIndex(0);
    };

    const showNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % modalImages.length);
    };

    const showPrevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + modalImages.length) % modalImages.length);
    };

    const editItem = (item: Item) => {
        setEditItemId(item.id!);
        setNewItem({
            number: item.number,
            date: item.date,
            story: item.story,
            images: null,
        });

        formRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const filteredItems = showFavorites ? items.filter(item => item.favorite) : items;
    const currentItems = filteredItems
        .sort((a, b) => parseInt(b.number) - parseInt(a.number))
        .slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const clearForm = () => {
        setNewItem({ number: '', date: '', story: '', images: null });
        setEditItemId(null);
    };

    return (
        <>
        <main className='flex flex-col items-center justify-between mx-auto' ref={formRef}>
            <div className='z-10 items-center justify-between text-sm'>
                <div className='flex justify-center'>
                    <img
                        src="https://i.ibb.co/FnPQjw0/bgless.png"
                        alt="logo"
                        className="w-30 h-20 mb-10"
                    />
                </div>
                <section className='flex flex-col justify-center items-center gap-5'>
                    <div className='bg-slate-800 p-4 rounded-lg flex flex-col w-auto '>
                        <div className='p-4 overflow-auto flex gap-4'>
                            <form className='flex flex-col gap-3 items-center text-black overflow-hidden'>
                                <div className='flex w-full mb-2 justify-between gap-3 max-sm:flex-col'>
                                    <input
                                        value={newItem.number}
                                        onChange={(e) => setNewItem({ ...newItem, number: e.target.value })}
                                        className='w-3/4  max-sm:w-full border-0 bg-gray-700  text-gray-200  rounded-md p-3 focus:outline-none transition ease-in-out duration-150'
                                        type='text'
                                        placeholder='Enter Number'
                                    />
                                    <input
                                        value={newItem.date}
                                        onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
                                        className='w-3/4 max-sm:w-full border-0 bg-gray-700  text-gray-200  rounded-md p-3 focus:outline-none transition ease-in-out duration-150'
                                        type='date'
                                        placeholder='Enter Date'
                                    />
                                </div>
                                <textarea
                                    value={newItem.story}
                                    onChange={(e) => setNewItem({ ...newItem, story: e.target.value })}
                                    className="bg-gray-700 w-full mb-2 text-gray-200 border-0 rounded-md p-3 focus:outline-none transition ease-in-out duration-150"
                                    rows={6}
                                    placeholder='Enter about the day'
                                />
                                <input
                                    className="block w-full mb-2 p-2 text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                                    id="multiple_files"
                                    type="file"
                                    onChange={(e) => setNewItem({ ...newItem, images: e.target.files ? Array.from(e.target.files) : null })}
                                    multiple
                                />
                                <button
                                    onClick={addItem}
                                    className="flex items-center justify-center text-white bg-primary1 hover:bg-slate-900 p-2 text-lg w-3/4 rounded-lg transition duration-100 ease-linear"
                                    disabled={loading}
                                    type="submit"
                                >
                                    {loading ? <Loader /> : null}
                                    <span className={`${loading ? "ml-2" : ""}`}>
                                        {editItemId ? "Update Memory" : "Add Memory"}
                                    </span>
                                </button>
                                <button
                                    onClick={clearForm}
                                    className='text-primary1'
                                    type='button'
                                >
                                    Clear Memory
                                </button>
                            </form>
                            <div className='max-sm:hidden'>
                                <img 
                                    src='https://i.ibb.co/X44Y7s9/bc24b2dd54aeb8d2cb19593a6fef29f0.gif'
                                    alt='form_image'
                                    className='w-[500px] h-[370px] rounded-lg'
                                />
                            </div>
                        </div>
                    </div>
                    <div className='w-full p-4'>
                        <div className='flex justify-start mb-8 text-[12px] font-semibold text-white'>
                            <button
                                className={`px-4 py-2 rounded-l-full ${!showFavorites ? 'bg-slate-700' : 'bg-slate-500'}`}
                                onClick={() => setShowFavorites(false)}
                            >
                                All
                            </button>
                            <button
                                className={`px-4 py-2 rounded-r-full ${showFavorites ? 'bg-slate-700' : 'bg-slate-500'}`}
                                onClick={() => setShowFavorites(true)}
                            >
                                Favorites
                            </button>
                        </div>
                        <ul className='grid max-sm:grid-cols-1 xl:grid-cols-4 max-lg:grid-cols-3 gap-4 text-white'>
                            {currentItems.map((item, id) => (
                                <li
                                    key={id}
                                    className='bg-slate-950 shadow-lg rounded-2xl flex flex-col'
                                >
                                    <div className='p-4 flex-grow flex flex-col justify-between'>
                                        <div>
                                            <div className='flex flex-row justify-between mb-4'>
                                                <span className='text-sm font-semibold'>#{item.number}</span>
                                                <span className='text-sm font-semibold'>{formatDate(item.date)}</span>
                                            </div>
                                            <div className='flex justify-center'>
                                                {item.imageUrls && item.imageUrls.length > 0 ? (
                                                    <div
                                                        className='w-full h-[200px] overflow-hidden relative group cursor-pointer'
                                                        onClick={() => openModal(item.imageUrls!, 0)}
                                                    >
                                                        <img src={item.imageUrls[0]} alt="Uploaded" className='w-full h-full object-cover rounded-t-lg mb-4' />
                                                        {item.imageUrls.length > 1 && (
                                                            <div className='absolute top-2 right-2'>
                                                                <Stack/>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className='w-full h-[200px] overflow-hidden'>
                                                        <img src={placeholderImage} alt="Placeholder" className='w-full h-full object-cover rounded-t-lg mb-4' />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className='mt-4 h-[12rem] overflow-x-hidden overflow-y-auto'>
                                            <span className='text-lg break-words'>{item.story}</span>
                                        </div>
                                    </div>
                                    <div className='flex justify-between'>
                                        <button
                                            onClick={() => toggleFavorite(item.id!, item.favorite!)}
                                            className={`w-full flex gap-2 justify-center items-center p-4 border-t-2 border-slate-900 hover:bg-slate-900 text-center`}
                                        >
                                            <Favorite filled={item.favorite!}/>
                                        </button>
                                        <button
                                            onClick={() => editItem(item)}
                                            className='w-full flex gap-2 justify-center items-center p-4 border-t-2 border-slate-900 hover:bg-slate-900 text-center'
                                        >
                                            <Edit />
                                        </button>
                                        <button
                                            onClick={() => deleteItem(item.id!)}
                                            className='w-full flex gap-2 justify-center items-center p-4 border-t-2 border-slate-900 hover:bg-slate-900 text-center'
                                        >
                                            <Delete />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className='flex justify-between mt-4'>
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className='bg-slate-950 hover:bg-slate-900 text-white p-2 rounded'
                            >
                                &larr; Previous
                            </button>
                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={indexOfLastItem >= filteredItems.length}
                                className='bg-slate-950 hover:bg-slate-900 text-white p-2 rounded'
                            >
                                Next &rarr;
                            </button>
                        </div>
                    </div>
                </section>
            </div>
            {modalImages.length > 0 && (
                <ImageModal
                    images={modalImages}
                    currentIndex={currentImageIndex}
                    onClose={closeModal}
                    onNext={showNextImage}
                    onPrev={showPrevImage} isOpen={false}                
                />
            )}
        </main>
        <ToastContainer />
        </>
    );
};

export default Memory;