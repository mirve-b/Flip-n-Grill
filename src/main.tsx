import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import App from "./App";
import "./styles.css";
import { forcedLite, lowEnd } from "./lib/device";

// weak devices get a lighter stylesheet path (static backgrounds, fewer effects)
if (lowEnd) document.documentElement.classList.add("lite");
if (forcedLite) document.documentElement.classList.add("lite-preview");

gsap.registerPlugin(ScrollTrigger, useGSAP);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
