import "./page.css";
import "../component/slide";
import Slide from "../component/slide";
function Page() {
  return (
    <div id="main">
      <div id="header" className="mt-[28vh]">
        <div id="center" className="">
          <img id="logo" src={"logo.svg"} alt="Logo" />
        </div>

        <div>
          <Slide></Slide>
        </div>
      </div>
    </div>
  );
}
export default Page;
