import { useEffect, useState } from "react";
import "./App.css";
import { IoCall, IoChatbubblesOutline } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import {
  FaCar,
  FaCarSide,
  FaCity,
  FaFacebook,
  FaLocationArrow,
  FaLongArrowAltLeft,
  FaLongArrowAltRight,
  FaShoppingCart,
  FaSnapchatGhost,
  FaTruck,
  FaWhatsapp,
} from "react-icons/fa";
import { HiArrowLongLeft, HiArrowLongRight } from "react-icons/hi2";
import { IoMdFlashlight } from "react-icons/io";
import {
  FaArrowLeftLong,
  FaArrowRightLong,
  FaCarBurst,
  FaHouseChimney,
} from "react-icons/fa6";
import { BiSolidTrain } from "react-icons/bi";
import { PiClockCountdownFill } from "react-icons/pi";
import { LuNotepadText } from "react-icons/lu";
import { SiMaterialdesignicons, SiMonkeytype } from "react-icons/si";
import { TbBrandGmail } from "react-icons/tb";

function App() {
  const [reloading, setReloading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(false);
    }, 1300);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  const handleReload = () => {
    if (reloading) return;
    setReloading(true);
    window.setTimeout(() => {
      window.location.reload();
    }, 1200);
  };

  return (
    <>
      <div className={`app-wrapper ${loading ? "app-loading" : ""}`}>
        <div className={`reload-overlay ${reloading ? "active" : ""}`}>
          <div className="reload-card">
            <div className="reload-spinner">
              <FaTruck />
            </div>
            <p>Reloading the site…</p>
          </div>
        </div>
        <div
          className={`truck-animation-wrapper ${reloading ? "reload-center" : ""}`}
        >
          <div
            className={`truck-icon ${loading ? "truck-loading" : reloading ? "truck-reload" : "truck-entrance"}`}
          >
            <FaTruck />
          </div>
        </div>
        <header className="bg-[url(/public/imgs/hero_bg.jpg)] bg-cover bg-no-repeat bg-center text-white">
          <div className="parda z-0 bg-linear-90 from-[#18262F] to-transparent bg-position-[0%] hero_animation">
            <nav>
              {/* Top */}
              <div className="max-[900px]:hidden  flex items-center justify-center gap-70 bg-[#06303C] text-white w-full">
                <ul className="flex items-center gap-7 link">
                  <li className="flex items-center gap-5 pr-2.5  border-r">
                    <IoCall /> +010 12345678
                  </li>
                  <li className="flex items-center gap-5 pr-2.5  border-r">
                    <MdEmail /> youremailaddress@email.com
                  </li>
                  <li className="flex items-center gap-5 pr-2.5  border-r">
                    <FaCity /> your address text here
                  </li>
                </ul>
                <div className="max-[900px]:hidden flex items-center gap-8 bg-[#fb5621] p-2 yumaloq right-0">
                  <p>Mon-Fri 9:00 - 05:00</p>
                  <ul className="flex items-center gap-7 link">
                    <li>
                      <FaFacebook />
                    </li>
                    <li>
                      <IoChatbubblesOutline />
                    </li>
                    <li>
                      <FaWhatsapp />
                    </li>
                  </ul>
                </div>
              </div>
              {/* Top */}
              <div className="container_1200 pt-7 pb-7 ">
                <div className="flex items-center justify-between max-[900px]:flex-col max-[900px]:gap-4">
                  <h1 className="text-3xl font-bold">DuozhuaMiao</h1>
                  <ul className="flex items-center gap-7 link">
                    <li>Home</li>
                    <li>About</li>
                    <li>Service</li>
                    <li>Projects</li>
                    <li>Team</li>
                    <li>Blog</li>
                    <li>Contact Us</li>
                  </ul>
                  <ul className="flex items-center gap-6">
                    <li className="flex items-center gap-0.5">
                      <span className="text-2xl">
                        <FaShoppingCart />
                      </span>
                      <span className="bg-[#fb5621] p-1 text-white rounded-4xl">
                        2
                      </span>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          const parda = document.querySelector(".parda");
                          parda.classList.toggle("lightChange");
                        }}
                        className="flex p-3 items-center gap-2 bg-[#fb5621] text-white rounded-4xl"
                      >
                        turn on the headlights{" "}
                        <span className="bg-black p-1 rounded-4xl">
                          <IoMdFlashlight />
                        </span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={handleReload}
                        className="flex p-3 items-center gap-2 bg-[#ffffff22] text-white rounded-4xl border border-white"
                      >
                        <FaTruck /> Reload
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
            {/* Hero */}
            <div className=" pb-5 ">
              <div className="container_1200 cont flex items-center justify-between max-[900px]:flex-wrap max-[900px]:justify-center max-[900px]:text-center">
                {/* card */}
                <div className="w-2xl max-[900px]:w-full">
                  <h2>🚛 Delivering smartest logistics solutions</h2>
                  <h1 className="text-5xl font-bold pt-6 pb-6">
                    Moving Made Easy Wherever Life Takes You!
                  </h1>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                  </p>
                  <div className="w-md flex items-center gap-5 pt-4 pb-4">
                    <button className="flex text-white bg-[#fb5621] p-3 rounded-4xl">
                      About us{" "}
                      <span className="bg-black p-1 rounded-4xl">
                        <FaLongArrowAltRight />
                      </span>
                    </button>
                    <div className="flex items-center ">
                      <img src="/public/imgs/hero_img_1.png" alt="" />
                      <h1 className="flex items-center gap-1 flex-col">
                        Satisfied Customers <span>4.1 stars</span>
                      </h1>
                    </div>
                  </div>
                </div>
                {/* card */}
                <div className="w-80 max-[900px]:hidden">
                  <div>
                    <span className="border border-gray-400 p-1.5 flex items-center justify-center w-12">
                      {" "}
                      <FaLongArrowAltLeft />
                    </span>{" "}
                    <span className="border border-gray-400 p-1.5 flex items-center justify-center w-12 mt-3.5">
                      <FaLongArrowAltRight />
                    </span>
                  </div>
                  <div className="flex items-center gap-2 w-full max-[900px]:hidden">
                    <div>
                      <img
                        className="w-96 h-30 object-contain"
                        src="/public/imgs/hero_img2.png"
                        alt=""
                      />
                    </div>
                    <div>
                      <h1>Global shipment made easy.</h1>
                      <p>Lorem ipsum dolor sit amet, sed do eiusmod tempor </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Hero */}
          </div>
        </header>

        <main>
          <section>
            <div className="container_1200 cont max-[900px]:pr-4 max-[900px]:pl-4 flex items-center justify-between max-[900px]:justify-center max-[900px]:flex-col">
              {/* card */}
              <div className="w-2xl max-[900px]:w-full">
                <h2 className="flex items-center max-[900px]:justify-center gap-1.5 font-bold text-[#fb5621]">
                  <span>
                    <HiArrowLongLeft />
                  </span>
                  About Us
                  <span>
                    <HiArrowLongRight />
                  </span>
                </h2>
                <h1 className="text-5xl font-bold max-[900px]:text-center">
                  Driven by Trust, Powered{" "}
                  <span className="text-[#fb5621]">by Experience</span>
                </h1>
                <div className="flex items-center gap-10 pt-6 pb-6">
                  <div className="w-60 pt-3 pb-3 text-center">
                    <h1 className="flex items-center justify-center gap-10">
                      <span className="p-2.5 bg-[#fb5621] text-white rounded-4xl">
                        <FaCarSide />
                      </span>
                      Satisfied Customers
                    </h1>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </p>
                  </div>
                  <div className="w-60 pt-3 pb-3 text-center">
                    <h1 className="flex items-center justify-center gap-10">
                      <span className="p-2.5 bg-[#fb5621] text-white rounded-4xl">
                        <FaCarSide />
                      </span>
                      Satisfied Customers
                    </h1>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </p>
                  </div>
                </div>
                <p className="text-gray-500 max-[900px]:pr-4 max-[900px]:pl-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </p>
                <div>
                  <button className="flex items-center gap-2 bg-[#fb5621] p-3 text-white rounded-4xl mt-5">
                    Read more
                    <span className="p-1 bg-black text-white rounded-4xl">
                      <FaLongArrowAltRight />
                    </span>
                  </button>
                </div>
              </div>
              {/* card */}
              <div className="max-[900px]:hidden">
                <img src="/public/imgs/section_1_img.png" alt="" />
              </div>
            </div>
          </section>

          <section>
            <div className="container_1200 cont">
              <div className="text-center">
                <h1 className="text-center max-[900px]:justify-center flex items-center text-[#fb5621] font-bold gap-1.5">
                  <span>
                    <FaArrowLeftLong />
                  </span>
                  Services
                  <span>
                    <FaArrowRightLong />
                  </span>
                </h1>
              </div>
              {/* Box */}
              <div className="flex items-start justify-between gap-3.5 flex-wrap pt-5 max-[900px]:flex-wrap max-[900px]:justify-center">
                {/* card */}
                <div className="w-80 max-[900px]:w-full">
                  <h1 className="text-4xl font-bold">
                    Our Trusted <br />
                    Logistics Services
                  </h1>
                </div>
                {/* card */}
                <div className="w-80 max-[900px]:w-full shadow shadow-olive-400 p-2.5 hover">
                  <img src="/public/imgs/section2_1.png" alt="" />
                  <h1 className="flex items-center font-bold gap-3 pt-4 pb-4 ">
                    {" "}
                    <span className="text-[#fb5621]">
                      <FaCar />
                    </span>
                    Global reach
                  </h1>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo
                    consequat.{" "}
                  </p>
                </div>
                <div className="w-80 max-[900px]:w-full shadow shadow-olive-400 p-2.5 hover">
                  <img src="/public/imgs/section2_2.png" alt="" />
                  <h1 className="flex items-center font-bold gap-3 pt-4 pb-4 ">
                    {" "}
                    <span className="text-[#fb5621]">
                      <FaCar />
                    </span>
                    Global reach
                  </h1>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo
                    consequat.{" "}
                  </p>
                </div>
                <div className="w-80 max-[900px]:w-full shadow shadow-olive-400 p-2.5 hover">
                  <img src="/public/imgs/section2_3.png" alt="" />
                  <h1 className="flex items-center font-bold gap-3 pt-4 pb-4 ">
                    {" "}
                    <span className="text-[#fb5621]">
                      <FaCar />
                    </span>
                    Global reach
                  </h1>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo
                    consequat.{" "}
                  </p>
                </div>
                <div className="w-80 max-[900px]:w-full shadow shadow-olive-400 p-2.5 hover">
                  <img src="/public/imgs/section2_4.png" alt="" />
                  <h1 className="flex items-center font-bold gap-3 pt-4 pb-4 ">
                    {" "}
                    <span className="text-[#fb5621]">
                      <FaCar />
                    </span>
                    Global reach
                  </h1>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo
                    consequat.{" "}
                  </p>
                </div>
                <div className="w-80 shadow shadow-olive-400 p-2.5 hover">
                  <img src="/public/imgs/section2_1.png" alt="" />
                  <h1 className="flex items-center font-bold gap-3 pt-4 pb-4 ">
                    {" "}
                    <span className="text-[#fb5621]">
                      <FaCar />
                    </span>
                    Global reach
                  </h1>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo
                    consequat.{" "}
                  </p>
                </div>
              </div>
              {/* box */}
            </div>
          </section>

          <section>
            <div className="container_1200 cont flex items-center justify-between max-[900px]:flex-col max-[900px]:text-center">
              <div className="w-2xl">
                <h1 className="text-center max-[900px]:justify-center flex items-center text-[#fb5621] font-bold gap-1.5">
                  <span>
                    <FaArrowLeftLong />
                  </span>
                  Our skills
                  <span>
                    <FaArrowRightLong />
                  </span>
                </h1>
                <h1 className="font-bold text-4xl">
                  Skills That Keep Your <br /> Business{" "}
                  <span className="text-[#fb5621]">Moving</span>
                </h1>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur.
                </p>
                {/*  */}
                <div className="max-[900px]:pr-2 max-[900px]:pl-2 max-[900px]:flex max-[900px]:items-center max-[900px]:justify-center max-[900px]:flex-col">
                  <p>Advanced logistics planning</p>
                  <div className="full_1 w-full bg-[#f5f5f5] h-5 mt-2 mb-2 border border-orange-500"></div>
                  <p>Real-time tracking systems</p>
                  <div className="full_2 w-full bg-[#f5f5f5] h-5 mt-2 mb-2 border border-orange-500"></div>
                  <p>Secure warehosing</p>
                  <div className="full_3 w-full bg-[#f5f5f5] h-5 mt-2 mb-2 border border-orange-500"></div>
                  <p>Customer-centered support</p>
                  <div className="full_4 w-full bg-[#f5f5f5] h-5 mt-2 mb-2 border border-orange-500"></div>
                </div>
                <button
                  onClick={() => {
                    const full_1 = document.querySelector(".full_1");
                    const full_2 = document.querySelector(".full_2");
                    const full_3 = document.querySelector(".full_3");
                    const full_4 = document.querySelector(".full_4");

                    full_1.classList.toggle("chart_1");
                    full_2.classList.toggle("chart_2");
                    full_3.classList.toggle("chart_3");
                    full_4.classList.toggle("chart_4");
                  }}
                  className=" chartBtn flex items-center gap-2.5 bg-[#fb5621] p-2.5 text-white rounded-4xl max-[900px]:ml-4 max-[900px]:mr-4"
                >
                  Click Here{" "}
                  <span className="bg-black text-white p-1 rounded-4xl">
                    <FaLongArrowAltRight />
                  </span>
                </button>
              </div>
              {/* 0 */}
              <div className="relative">
                <div
                  className="
              w-90 h-90 absolute z-[-1] bg-linear-180 from-[#fb5621] to-transparent rounded-full
              top-0 left-12 max-[900px]:w-60 max-[900px]:h-60
              "
                ></div>
                <img className="z-10" src="/public/imgs/section3.png" alt="" />
              </div>
            </div>
          </section>

          <section className="bg-[#F3F4F8]">
            <div className="container_1200 cont">
              <div className="text-center pt-5 pb-5 ">
                <h1 className="text-center flex items-center justify-center text-[#fb5621] font-bold gap-1.5">
                  <span>
                    <FaArrowLeftLong />
                  </span>
                  Working Process
                  <span>
                    <FaArrowRightLong />
                  </span>
                </h1>
                <h1 className="font-bold text-4xl">
                  Our Seamless Moving <br /> Process.
                </h1>
              </div>
              {/* Box */}
              <div className="flex items-center justify-between max-[900px]:flex-wrap max-[900px]:gap-7 max-[900px]:justify-center">
                <div className="w-55 text-center gap-3 flex items-center justify-center flex-col">
                  <div>
                    <span className="text-center flex items-center justify-center p-3 w-14 rounded-[50%] text-white text-3xl bg-[#fb5621] border-2 border-orange-400">
                      <FaCarBurst />
                    </span>
                  </div>
                  <h1 className="font-bold">Inltial Consultation</h1>
                  <p className="text-gray-500 pt-3 pb-3">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim a
                  </p>
                </div>
                <div className="w-55 text-center gap-3 flex items-center justify-center flex-col">
                  <div>
                    <span className="text-center flex items-center justify-center p-3 w-14 rounded-[50%] text-white text-3xl bg-[#fb5621] border-2 border-orange-400">
                      <FaCarBurst />
                    </span>
                  </div>
                  <h1 className="font-bold">Inltial Consultation</h1>
                  <p className="text-gray-500 pt-3 pb-3">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim a
                  </p>
                </div>
                <div className="w-55 text-center gap-3 flex items-center justify-center flex-col">
                  <div>
                    <span className="text-center flex items-center justify-center p-3 w-14 rounded-[50%] text-white text-3xl bg-[#fb5621] border-2 border-orange-400">
                      <FaCarBurst />
                    </span>
                  </div>
                  <h1 className="font-bold">Inltial Consultation</h1>
                  <p className="text-gray-500 pt-3 pb-3">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim a
                  </p>
                </div>
                <div className="w-55 text-center gap-3 flex items-center justify-center flex-col">
                  <div>
                    <span className="text-center flex items-center justify-center p-3 w-14 rounded-[50%] text-white text-3xl bg-[#fb5621] border-2 border-orange-400">
                      <FaCarBurst />
                    </span>
                  </div>
                  <h1 className="font-bold">Inltial Consultation</h1>
                  <p className="text-gray-500 pt-3 pb-3">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim a
                  </p>
                </div>
              </div>
              {/* Box */}
            </div>
          </section>

          <section className="bg-[#313131]">
            <div className="container_1200 cont ">
              <div className="flex items-center justify-between max-[900px]:flex-col max-[900px]:justify-center max-[900px]:gap-5">
                <div>
                  <div className="text-center">
                    <h1 className="text-center flex items-center text-white font-bold gap-1.5">
                      <span>
                        <FaArrowLeftLong />
                      </span>
                      Feedback
                      <span>
                        <FaArrowRightLong />
                      </span>
                    </h1>
                    <h1 className="text-white text-left font-bold text-4xl">
                      Hear From Our Happy Clients
                    </h1>
                  </div>
                </div>
                {/*  */}
                <div className="flex items-center justify-center flex-col gap-2">
                  <h1 className="flex items-center gap-1.5 text-white">
                    {" "}
                    <span className="p-2 border border-white">
                      <FaLongArrowAltLeft />
                    </span>
                    01/03
                    <span className="p-2 border border-white">
                      <FaLongArrowAltRight />
                    </span>
                  </h1>
                  <div className="flex items-center justify-between gap-3.5 flex-wrap">
                    <div className="text-white w-[18.75rem] max-[700px]:w-full min-w-0 text-right bg-[#5A5A5A] p-3 hover">
                      <p className="text-gray-300">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor
                      </p>
                      <h1 className="font-bold">Username</h1>
                      <h1>job title</h1>
                    </div>
                    <div className="text-white w-[18.75rem] max-[700px]:w-full min-w-0 text-right bg-[#5A5A5A] p-3 hover">
                      <p className="text-gray-300">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor
                      </p>
                      <h1 className="font-bold">Username</h1>
                      <h1>job title</h1>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-10 flex-wrap gap-4 max-[900px]:flex-wrap max-[900px]:gap-4 max-[900px]:justify-center">
                <img
                  className="max-[700px]:w-full max-[700px]:h-auto"
                  src="/public/imgs/section5_1.png"
                  alt=""
                />
                <img
                  className="max-[700px]:w-full max-[700px]:h-auto"
                  src="/public/imgs/section5_2.png"
                  alt=""
                />
                <img
                  className="max-[700px]:w-full max-[700px]:h-auto"
                  src="/public/imgs/section5_1.png"
                  alt=""
                />
                <img
                  className="max-[700px]:w-full max-[700px]:h-auto"
                  src="/public/imgs/section5_2.png"
                  alt=""
                />
                <img
                  className="max-[700px]:w-full max-[700px]:h-auto"
                  src="/public/imgs/section5_1.png"
                  alt=""
                />
              </div>
            </div>
          </section>

          <section>
            <div className="container_1200 cont">
              <div className="text-center flex items-center justify-center flex-col gap-1.5">
                <h1 className="text-center flex items-center text-[#fb5621] font-bold gap-1.5">
                  <span>
                    <FaArrowLeftLong />
                  </span>
                  Our experts
                  <span>
                    <FaArrowRightLong />
                  </span>
                </h1>
                <h1 className="text-4xl font-bold">
                  Meet the Experts Behind{" "}
                  <span className="text-[#fb5621]">Transport Logistics</span>
                </h1>
              </div>
              {/* Box */}
              <div className="flex items-center justify-between pt-8 max-[900px]:flex-wrap max-[900px]:justify-center max-[900px]:gap-5">
                <div className="w-45 hover p-2">
                  <img src="/public/imgs/section6_1.png" alt="" />
                  <h1 className="flex items-center justify-between pt-4 pb-4 font-bold">
                    Eleanor <br /> Pena
                    <span className="bg-[#fb5621] p-3 rounded-4xl text-white text-2xl">
                      <BiSolidTrain />
                    </span>
                  </h1>
                  <p className="text-gray-500">Project Manager</p>
                  <hr className="text-[#fb5621] font-bold " />
                </div>
                <div className="w-45 hover p-2">
                  <img src="/public/imgs/section6_2.png" alt="" />
                  <h1 className="flex items-center justify-between pt-4 pb-4 font-bold">
                    Eleanor <br /> Pena
                    <span className="bg-[#fb5621] p-3 rounded-4xl text-white text-2xl">
                      <BiSolidTrain />
                    </span>
                  </h1>
                  <p className="text-gray-500">Project Manager</p>
                  <hr className="text-[#fb5621] font-bold " />
                </div>
                <div className="w-45 hover p-2">
                  <img src="/public/imgs/section6_3.png" alt="" />
                  <h1 className="flex items-center justify-between pt-4 pb-4 font-bold">
                    Eleanor <br /> Pena
                    <span className="bg-[#fb5621] p-3 rounded-4xl text-white text-2xl">
                      <BiSolidTrain />
                    </span>
                  </h1>
                  <p className="text-gray-500">Project Manager</p>
                  <hr className="text-[#fb5621] font-bold " />
                </div>
                <div className="w-45 hover p-2">
                  <img src="/public/imgs/section6_1.png" alt="" />
                  <h1 className="flex items-center justify-between pt-4 pb-4 font-bold">
                    Eleanor <br /> Pena
                    <span className="bg-[#fb5621] p-3 rounded-4xl text-white text-2xl">
                      <BiSolidTrain />
                    </span>
                  </h1>
                  <p className="text-gray-500">Project Manager</p>
                  <hr className="text-[#fb5621] font-bold " />
                </div>
                <div className="w-45 hover p-2">
                  <img src="/public/imgs/section6_1.png" alt="" />
                  <h1 className="flex items-center justify-between pt-4 pb-4 font-bold">
                    Eleanor <br /> Pena
                    <span className="bg-[#fb5621] p-3 rounded-4xl text-white text-2xl">
                      <BiSolidTrain />
                    </span>
                  </h1>
                  <p className="text-gray-500">Project Manager</p>
                  <hr className="text-[#fb5621] font-bold " />
                </div>
              </div>
              {/* box */}
            </div>
          </section>

          <section>
            <div className="container_1200">
              <div>
                {" "}
                <h1 className="text-center max-[900px]:justify-center flex items-center text-[#fb5621] font-bold gap-1.5">
                  <span>
                    <FaArrowLeftLong />
                  </span>
                  Our Skills
                  <span>
                    <FaArrowRightLong />
                  </span>
                </h1>
                <h1 className="font-bold text-4xl max-[900px]:text-center">
                  Frequently Asked{" "}
                  <span className="text-[#fb5621]">Questions</span>
                </h1>
              </div>
              {/*  */}
              <div className="flex items-center justify-between pt-5 pb-5 max-[900px]:flex-wrap max-[900px]:justify-center">
                <div className="pt-5 pb-5 flex items-center flex-col gap-3.5">
                  <div className="w-lg flex items-center flex-col justify-between border border-gray-500 p-3.5 rounded-4xl hover">
                    <div className="flex items-center justify-between gap-50">
                      <h1 className="font-bold">
                        Model, Travel, Weightlifting
                      </h1>
                      <button
                        onClick={() => {
                          const hide_p = document.querySelector(".hide_p");
                          hide_p.classList.toggle("hidden");
                        }}
                        className="bg-[#fb6521] p-2.5 cursor-pointer rounded-4xl text-white"
                      >
                        <span>
                          <FaLocationArrow />
                        </span>
                      </button>
                    </div>
                    <p className="text-gray-500 hidden hide_p">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      Duis aute irure dolor in.
                    </p>
                  </div>
                  <div className="w-lg flex items-center flex-col justify-between border border-gray-500 p-3.5 rounded-4xl hover">
                    <div className="flex items-center justify-between gap-50">
                      <h1 className="font-bold">
                        Model, Travel, Weightlifting
                      </h1>
                      <button
                        onClick={() => {
                          const hide_p1 = document.querySelector(".hide_p1");
                          hide_p1.classList.toggle("hidden");
                        }}
                        className="bg-[#fb6521] p-2.5 cursor-pointer rounded-4xl text-white"
                      >
                        <span>
                          <FaLocationArrow />
                        </span>
                      </button>
                    </div>
                    <p className="text-gray-500 hidden hide_p1">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      Duis aute irure dolor in.
                    </p>
                  </div>
                  <div className="w-lg flex items-center flex-col justify-between border border-gray-500 p-3.5 rounded-4xl hover">
                    <div className="flex items-center justify-between gap-50">
                      <h1 className="font-bold">
                        Model, Travel, Weightlifting
                      </h1>
                      <button
                        onClick={() => {
                          const hide_p2 = document.querySelector(".hide_p2");
                          hide_p2.classList.toggle("hidden");
                        }}
                        className="bg-[#fb6521] p-2.5 cursor-pointer rounded-4xl text-white"
                      >
                        <span>
                          <FaLocationArrow />
                        </span>
                      </button>
                    </div>
                    <p className="text-gray-500 hidden hide_p2">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      Duis aute irure dolor in.
                    </p>
                  </div>
                  <div className="w-lg flex items-center flex-col justify-between border border-gray-500 p-3.5 rounded-4xl hover">
                    <div className="flex items-center justify-between gap-50">
                      <h1 className="font-bold">
                        Model, Travel, Weightlifting
                      </h1>
                      <button
                        onClick={() => {
                          const hide_p3 = document.querySelector(".hide_p3");
                          hide_p3.classList.toggle("hidden");
                        }}
                        className="bg-[#fb6521] p-2.5 cursor-pointer rounded-4xl text-white"
                      >
                        <span>
                          <FaLocationArrow />
                        </span>
                      </button>
                    </div>
                    <p className="text-gray-500 hidden hide_p3">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      Duis aute irure dolor in.
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <div className="bg-linear-180 from-[#fb5621] to-transparent w-90 h-90 absolute  rounded-full -top-[50px] right-8 -z-10 max-[900px]:w-50 max-[900px]:h-50 max-[900px]:right-0"></div>
                  <img
                    className="z-10"
                    src="/public/imgs/section7_1.png"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="container_1200 cont">
              <div className="pt-5 pb-5 text-center">
                <h1 className="text-center flex items-center justify-center text-[#fb5621] font-bold gap-1.5">
                  <span>
                    <FaArrowLeftLong />
                  </span>
                  Blog & News
                  <span>
                    <FaArrowRightLong />
                  </span>
                </h1>
                <h1 className="font-bold text-4xl">
                  Latest News Directly From{" "}
                  <span className="text-[#fb5621] ">Our Blog</span>
                </h1>
              </div>
              {/* box */}
              <div className="flex items-start justify-between gap-4 flex-wrap max-[900px]:flex-col max-[900px]:gap-4 max-[700px]:gap-6">
                <div className="shadow w-[38rem] max-[900px]:w-full max-[700px]:w-full p-4 hover rounded-2xl">
                  <img
                    className="w-full h-auto"
                    src="/public/imgs/section8_1.png"
                    alt=""
                  />
                  <h1 className="font-bold pt-4 text-xl max-[700px]:text-lg">
                    Women's Fashion, Men's Fashion, Music, <br /> Photography,
                    Nutrition, Cooking
                  </h1>
                  <p className="flex flex-wrap items-center gap-2 pt-3 text-sm max-[700px]:text-xs">
                    <span className="text-[#fb5621]">
                      <PiClockCountdownFill />
                    </span>
                    2029/09/21
                    <span className="text-[#fb5621]">
                      <LuNotepadText />
                    </span>
                    category
                  </p>
                  <div className="flex items-center justify-between pt-3 max-[700px]:flex-col max-[700px]:items-start max-[700px]:gap-3">
                    <h1 className="flex items-center gap-4 font-bold pt-3 max-[700px]:gap-3">
                      <img src="/public/imgs/section8_profile.png" alt="" />
                      Marvin McKinney <br /> Team Leader
                    </h1>

                    <button className="flex items-center gap-3 p-2 rounded-4xl bg-[#fb5621] text-white">
                      Read more{" "}
                      <span className="text-white bg-black p-2 rounded-4xl">
                        <FaLongArrowAltRight />
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-5 flex-col w-full max-[900px]:w-full">
                  <div className="shadow w-[34rem] max-[900px]:w-full max-[700px]:w-full p-3 hover flex items-start gap-3 rounded max-[700px]:flex-col max-[700px]:items-start max-[700px]:gap-4">
                    <img
                      className="w-40 object-cover h-full max-[700px]:w-full max-[700px]:h-auto"
                      src="/public/imgs/section8_2.png"
                      alt=""
                    />
                    <div className="w-full min-w-0">
                      <h1 className="font-bold text-lg max-[700px]:text-base">
                        Women's Fashion, Men's Fashion, Music, <br />{" "}
                        Photography, Nutrition, Cooking
                      </h1>
                      <p className="flex flex-wrap items-center gap-2 pt-3 text-sm max-[700px]:text-xs">
                        <span className="text-[#fb5621]">
                          <PiClockCountdownFill />
                        </span>
                        2029/09/21
                        <span className="text-[#fb5621]">
                          <LuNotepadText />
                        </span>
                        category
                      </p>
                      <div className="flex items-center justify-between pt-3 max-[700px]:flex-col max-[700px]:items-start max-[700px]:gap-3">
                        <h1 className="flex items-center gap-4 font-bold pt-3 max-[700px]:gap-3">
                          <img src="/public/imgs/section8_profile.png" alt="" />
                          Marvin McKinney <br /> Team Leader
                        </h1>

                        <button className="flex items-center gap-3 p-2 rounded-4xl bg-[#fb5621] text-white">
                          <span className="text-white bg-black p-2 rounded-4xl">
                            <FaLongArrowAltRight />
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="shadow w-[34rem] max-[900px]:w-full max-[700px]:w-full p-3 hover flex items-start gap-3 rounded max-[700px]:flex-col max-[700px]:items-start max-[700px]:gap-4">
                    <img
                      className="w-40 object-cover h-full max-[700px]:w-full max-[700px]:h-auto"
                      src="/public/imgs/section8_2.png"
                      alt=""
                    />
                    <div className="w-full min-w-0">
                      <h1 className="font-bold text-lg max-[700px]:text-base">
                        Women's Fashion, Men's Fashion, Music, <br />{" "}
                        Photography, Nutrition, Cooking
                      </h1>
                      <p className="flex flex-wrap items-center gap-2 pt-3 text-sm max-[700px]:text-xs">
                        <span className="text-[#fb5621]">
                          <PiClockCountdownFill />
                        </span>
                        2029/09/21
                        <span className="text-[#fb5621]">
                          <LuNotepadText />
                        </span>
                        category
                      </p>
                      <div className="flex items-center justify-between pt-3 max-[700px]:flex-col max-[700px]:items-start max-[700px]:gap-3">
                        <h1 className="flex items-center gap-4 font-bold pt-3 max-[700px]:gap-3">
                          <img src="/public/imgs/section8_profile.png" alt="" />
                          Marvin McKinney <br /> Team Leader
                        </h1>

                        <button className="flex items-center gap-3 p-2 rounded-4xl bg-[#fb5621] text-white">
                          <span className="text-white bg-black p-2 rounded-4xl">
                            <FaLongArrowAltRight />
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Box */}
            </div>
          </section>

          <section className="bg-[#313131] -z-30">
            <div className="container_1200 cont text-white">
              <div>
                <h1 className="text-center flex items-center text-white justify-center pt-5 pb-5 font-bold gap-1.5">
                  <span>
                    <FaArrowLeftLong />
                  </span>
                  Book
                  <span>
                    <FaArrowRightLong />
                  </span>
                </h1>
                <h1 className="font-bold text-3xl text-center">
                  Request Quote Form
                </h1>
              </div>
              {/* Box */}
              <div className="flex items-center justify-between max-[900px]:flex-col max-[900px]:justify-center">
                <div className="w-lg relative max-[900px]:hidden">
                  <img
                    className="z-50"
                    src="/public/imgs/section9_2.png"
                    alt=""
                  />
                  <h1 className="absolute -left-42 text-5xl text-gray-500 font-bold top-40 rotate-90">
                    Request quote
                  </h1>
                </div>
                <div className="w-2xl pt-5">
                  <form
                    className="flex max-[900px]:mr-2 max-[900px]:ml-2 items-center pt-2 pb-2.5 pl-20 pr-20 rounded-3xl gap-6 flex-wrap bg-[#ffffff4a]"
                    action=""
                  >
                    <div className="flex items-center justify-center flex-wrap gap-6">
                      <div>
                        <h1 className="font-bold">Username</h1>{" "}
                        <input
                          className="w-60 border-2 border-[#ffffff4a] p-2"
                          type="text"
                          required
                          placeholder="username"
                        />
                      </div>
                      <div>
                        <h1 className="font-bold">Email</h1>{" "}
                        <input
                          className="w-60 border-2 border-[#ffffff4a] p-2"
                          type="email"
                          required
                          placeholder="email"
                        />
                      </div>
                      <div>
                        {" "}
                        <h1 className="font-bold">
                          Cybersecurity - Broad
                        </h1>{" "}
                        <input
                          className="w-60 border-2 border-[#ffffff4a] p-2"
                          type="text"
                          required
                          placeholder="label"
                        />
                      </div>
                      <div>
                        {" "}
                        <h1 className="font-bold">HealthTech</h1>{" "}
                        <input
                          className="w-60 border-2 border-[#ffffff4a] p-2"
                          type="text"
                          required
                          placeholder="label"
                        />
                      </div>
                      <div>
                        {" "}
                        <h1 className="font-bold">Future of Work</h1>{" "}
                        <input
                          className="w-60 border-2 border-[#ffffff4a] p-2"
                          type="text"
                          required
                          placeholder="label"
                        />
                      </div>
                      <div>
                        <h1 className="font-bold">GovTech</h1>{" "}
                        <input
                          className="w-60 border-2 border-[#ffffff4a] p-2"
                          type="text"
                          required
                          placeholder="label"
                        />
                      </div>
                    </div>
                    {/*  */}
                    <div className="w-full">
                      <p className="text-left font-bold">Process bar</p>
                      <div
                        onMouseEnter={() => {
                          const full_11 = document.querySelector(".full_11");
                          full_11.classList.toggle("chart_1");
                        }}
                        className="full_11 w-full bg-[#f5f5f5] h-5 mt-2 mb-2 border border-orange-500"
                      ></div>
                    </div>
                    <button className="flex w-full rounded-4xl bg-[#fb5621] p-2.5 text-center items-center gap-20 justify-center">
                      Submit my request{" "}
                      <span className="bg-black p-2 rounded-4xl text-white right-0">
                        <FaLongArrowAltRight />
                      </span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-[#fb5621] text-white">
            <div className="container_1200 cont flex items-center justify-between">
              <div className="w-48 border border-transparent hover p-2">
                <h1 className="font-bold text-3xl">Contact us</h1>
                <p>tiny text here</p>
              </div>
              <div className="w-48 border border-transparent hover p-2">
                <h1 className="font-bold text-1xl flex items-center gap-1">
                  <span>
                    <LuNotepadText />
                  </span>{" "}
                  Design & Human
                </h1>
                <p>Lorem ipsum dolor sit amet, consectetur</p>
              </div>
              <div className="w-48 border border-transparent hover p-2">
                <h1 className="font-bold text-1xl flex items-center gap-1">
                  <span>
                    <FaHouseChimney />
                  </span>{" "}
                  Future of Work
                </h1>
                <p>Lorem ipsum dolor sit amet, consectetur</p>
              </div>
              <div className="w-48 border border-transparent hover p-2">
                <h1 className="font-bold text-1xl flex items-center gap-1">
                  <span>
                    <SiMaterialdesignicons />
                  </span>{" "}
                  3D Printing
                </h1>
                <p>Lorem ipsum dolor sit amet, consectetur</p>
              </div>
            </div>
          </section>
        </main>

        <footer className="bg-[#313131] text-white">
          <div className="container_1200 cont">
            <div className=" flex items-center justify-between max-[900px]:flex-col max-[900px]:gap-5 max-[900px]:pb-5">
              <h1>🚛 Delivering smartest logistics solutions</h1>
              <form
                className="flex items-center justify-between gap-2.5 w-2xs"
                action=""
              >
                <input
                  className=" bg-[#ffffff2e] rounded-4xl p-2.5"
                  type="text"
                  placeholder="Input your email address"
                  required
                />
                <button className="flex items-center gap-2 bg-[#fb5621] p-2 rounded-4xl">
                  subscribe
                  <span className="bg-black p-1 rounded-4xl">
                    <FaLongArrowAltRight />
                  </span>
                </button>
              </form>
            </div>
            {/* Box */}
            <div className="flex items-center justify-between max-[900px]:flex-wrap max-[900px]:justify-center max-[900px]:gap-4">
              <div className="w-lg">
                <h1 className="text-4xl text-white font-bold">
                  Subscribe To Our Newsletter To Get Latest Update
                </h1>
                <p className=" pt-5 pb-5">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id.
                </p>

                <div className="flex items-center gap-5 text-2xl font-bold ">
                  <span>
                    <SiMonkeytype />
                  </span>
                  <span>
                    <FaFacebook />
                  </span>
                  <span>
                    <FaSnapchatGhost />
                  </span>
                  <span>
                    <IoChatbubblesOutline />
                  </span>
                  <span>
                    <TbBrandGmail />
                  </span>
                </div>
              </div>
              <div className="flex items-stretch justify-between gap-15">
                <ul className="link leading-9">
                  <li className="font-bold">Quick Links</li>
                  <li>Vertual Reality - VR</li>
                  <li>EdTech</li>
                  <li>WomenInTech</li>
                  <li>Analytics</li>
                  <li>Future of Work</li>
                </ul>
                <ul className="link leading-9">
                  <li className="font-bold">Quick Links</li>
                  <li>Vertual Reality - VR</li>
                  <li>EdTech</li>
                  <li>WomenInTech</li>
                  <li>Analytics</li>
                  <li>Future of Work</li>
                </ul>
                <ul className="link leading-9">
                  <li className="font-bold">Quick Links</li>
                  <li>Vertual Reality - VR</li>
                  <li>EdTech</li>
                  <li>WomenInTech</li>
                  <li>Analytics</li>
                  <li>Future of Work</li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;
