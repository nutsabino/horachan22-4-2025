import React from "react";

const SectionOne = () => {
  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden md:block">
        <div
          className="relative bg-cover bg-center bg-no-repeat w-full"
          style={{
            backgroundImage: 'url("/images/1-section/cover-desktop.png")',
            height: "auto",
          }}
        >
          <img
            src="/images/1-section/cover-desktop.png"
            alt="Cover desktop"
            className="w-full h-auto invisible"
            style={{ margin: 0 }}
          />
          {/* <div className="absolute bottom-[15%] right-[13%] z-40 w-[40%] max-w-[560px]">
                        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                            <iframe
                                className='absolute top-0 left-0 w-full h-full rounded-lg'
                                src="https://www.youtube.com/embed/FqE4XqRexLw?si=rCIrfDULdjbS0L4e"
                                title="YouTube video player"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                            />
                        </div>
                    </div> */}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        <div
          className="min-h-screen relative bg-cover bg-center bg-no-repeat flex flex-col justify-between"
          style={{ backgroundImage: 'url("/images/1-section/bg.png")' }}
        >
          <div className=" w-full">
            <img
              src="/images/1-section/cover-mobile.png"
              alt="Cover mobile"
              className="w-full h-auto"
            />
            <div className="relative w-full pb-[100%]">
              {/* <iframe
                                className='absolute top-0 left-0 w-full h-full'
                                src="https://www.youtube.com/embed/FqE4XqRexLw?si=rCIrfDULdjbS0L4e"
                                title="YouTube video player"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                            /> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SectionOne;
