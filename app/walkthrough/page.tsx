import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Drone Walkthrough Review | JZ Group",
  description: "Mobile-ready review player for the JZ Group drone walkthrough motion study.",
  robots: { index: false, follow: false },
};

export default function WalkthroughPage() {
  return (
    <main className="walkthrough-page">
      <header>
        <Link href="/">JZ Group</Link>
        <span>Motion study / review</span>
      </header>
      <section>
        <div className="walkthrough-player">
          <video
            controls
            playsInline
            preload="metadata"
            poster="/media/jz-drone-walkthrough-poster.jpg"
          >
            <source src="/media/jz-drone-walkthrough.mp4" type="video/mp4" />
            Your browser does not support MP4 video playback.
          </video>
        </div>
        <div className="walkthrough-copy">
          <p>JZ Group / Drone walkthrough</p>
          <h1>Interior transformation motion study.</h1>
          <a href="/media/jz-drone-walkthrough.mp4" download>Download video</a>
        </div>
      </section>
    </main>
  );
}
