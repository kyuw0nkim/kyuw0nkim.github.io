import { motion } from "framer-motion";
import { site } from "../data/site";
import { KineticHeadline } from "./KineticHeadline";
import { ModePill } from "./ModeLinks";

const rise = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.12 + i * 0.09, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function IntroPanel() {
  return (
    <div className="intro">
      <motion.div variants={rise} initial="hidden" animate="show" custom={0}>
        <KineticHeadline selected={null} size="hero" />
      </motion.div>

      <motion.p className="intro__text" variants={rise} initial="hidden" animate="show" custom={1}>
        {site.heroIntro}
      </motion.p>

      <motion.div className="intro__explore" variants={rise} initial="hidden" animate="show" custom={2}>
        <p className="hint">
          <span className="hint__part">
            <span>
              <span className="hint__click">Click</span>
              <span className="hint__tap">Tap</span> the characters to explore
            </span>
            <ModePill mode="tracing" />
          </span>
          <span className="hint__part">
            <span>or the table for</span>
            <ModePill mode="shaping" />
          </span>
        </p>
      </motion.div>
    </div>
  );
}
