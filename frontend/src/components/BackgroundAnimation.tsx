import dynamic from "next/dynamic";
import GradientCanvas from "../components/GradientCanvas";

export const BackgroundAnimation = dynamic(() => import("../components/GradientCanvas"), { ssr: false });
