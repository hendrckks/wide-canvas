import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="min-h-[50vh] py-10 h-full w-full flex flex-col justify-center items-center text-white">
      <div className="w-full max-w-7xl border-t border-white/20 mb-20" />
      <div className="flex flex-col items-center justify-center mb-16">
        <p className="text-white font-semibold mb-4">
          HAVE A PROJECT IN MIND? CONTACT ME
        </p>
        <a
          href="mailto:info@aodfilm.com"
          className="text-black p-3 bg-white hover:bg-[#ff6017] transition-colors duration-200 font-semibold"
        >
          widecanvas@gmail.com
        </a>
        <div className="flex justify-center space-x-4 mt-4">
          <Link
            to="https://twitter.com/widecanvas"
            className="text-sm leading-relaxed font-semibold hover:text-[#ff6017] transition-colors"
          >
            TW
          </Link>
          <Link
            to="https://instagram.com/widecanvas"
            className="text-sm leading-relaxed font-semibold hover:text-[#ff6017] transition-colors"
          >
            IG
          </Link>
          <Link
            to="https://tiktok.com/@widecanvas"
            className="text-sm leading-relaxed font-semibold hover:text-[#ff6017] transition-colors"
          >
            TT
          </Link>
          <Link
            to="https://facebook.com/widecanvas"
            className="text-sm leading-relaxed font-semibold hover:text-[#ff6017] transition-colors"
          >
            FB
          </Link>
        </div>
      </div>
      <p className="font-semibold text-lg mb-12">End credits</p>
      <section className="grid grid-cols-2 gap-6 px-auto mb-10 max-w-xl">
        <h2 className="text-sm font-semibold">Media Curated by</h2>
        <div className="space-y-12">
          <p className="text-sm leading-relaxed font-semibold">WIDE CANVAS</p>
        </div>
      </section>

      {/* Film Categories Section */}
      <section className="grid grid-cols-2 gap-4  mb-10 max-w-xl">
        <h2 className="text-sm w-fit font-semibold">
          Media Categories Featured
        </h2>
        <div className="space-y-2">
          <p className="text-sm leading-relaxed font-semibold">HUMAN STORIES</p>
          <p className="text-sm leading-relaxed font-semibold">
            NATURE & WILDLIFE
          </p>
          <p className="text-sm leading-relaxed font-semibold">
            CULTURAL HERITAGE
          </p>
          <p className="text-sm leading-relaxed font-semibold">SOCIAL IMPACT</p>
          <p className="text-sm leading-relaxed font-semibold">
            COOPERATE PHOTOGRAPHY
          </p>
          <p className="text-sm leading-relaxed font-semibold">
            PRODUCT PHOTOGRAPHY
          </p>
        </div>
      </section>

      {/* Storytelling Approach Section */}
      <section className="grid grid-cols-2 gap-4 mb-10 max-w-xl">
        <h2 className="text-sm font-semibold">Designed and developed by</h2>
        <div className="space-y-4">
          <Link
            to="https://x.com/atomic_ke"
            className="text-sm leading-relaxed font-semibold underline underline-offset-4"
          >
            TETENGA / HENDRCKKS
          </Link>
        </div>
      </section>

      <img src="/end.png" className="h-[40vh] mb-8" />
      <p className="font-semibold text-sm text-white/80 max-w-xl text-center md:mx-0 mx-2 -mt-10 md:mb-16 mb-6">
        Any resemblance between the media showcased here and real life is purely
        coincidental… unless reality got a little too inspired.{" "}
        <br className="my-6" />
        All content is protected by copyright laws, but if you'd like to use
        something, just ask—filmmakers appreciate a good collaboration more than
        a good lawsuit.
      </p>
      <img src="/WIDELARGE2.webp" className="max-h-48 h-full md:mb-12 mb-8" />
      <div className="text-[#808080] text-xs tracking-tight font-medium text-center">
        © 2025 Wide Canvas | Live to Put Memories
        <br /> in a Wide Canvas. | All rights reserved.
      </div>
    </div>
  );
};

export default Footer;
