import Image from "next/image";
import Link from "next/link";

const Cta = () => {
    return (
        <section className="cta-section">
            {/* <div className="cta-badge">Real-time AI Teaching.</div> */}
            <h2 className="text-3xl font-bold">
                Design Your AI Teaching Assistant
            </h2>
            <p>Customize your AI's expertise, teaching style, and voice. Engage in interactive, real-time voice sessions tailored to your learning needs.</p>
            {/* <Image src="images/cta.svg" alt="cta" width={362} height={232} /> */}
            <button className="btn-primary">
                <Image src="/icons/plus.svg" alt="plus" width={12} height={12}/>
                <Link href="/companions/new">
                    <p>Build a New Companion</p>
                </Link>
            </button>
        </section>
    )
}
export default Cta
