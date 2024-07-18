interface ImageModalProps {
    images: string[];
    currentIndex: number;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ images, currentIndex, onClose, onNext, onPrev }) => {
    return (
        <div
            className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center z-50'
            onClick={onClose}
        >
            <div className='relative max-w-4xl max-h-4xl'>
                <button
                    className='absolute top-4 right-4 text-white text-2xl'
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                >
                    &times;
                </button>
                {images.length > 1 && (
                    <>
                        <button
                            className='absolute top-1/2 left-4 text-white text-2xl'
                            onClick={(e) => {
                                e.stopPropagation();
                                onPrev();
                            }}
                        >
                            &#9664;
                        </button>
                        <button
                            className='absolute top-1/2 right-4 text-white text-2xl'
                            onClick={(e) => {
                                e.stopPropagation();
                                onNext();
                            }}
                        >
                            &#9654;
                        </button>
                    </>
                )}
                <img
                    src={images[currentIndex]}
                    alt="Full View"
                    className='max-w-full max-h-full'
                />
            </div>
        </div>
    );
};

export default ImageModal;