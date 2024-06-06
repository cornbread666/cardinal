interface Props {
    name: string;
    gif: string;
    desc: string;
    link: string;
}

function Page({ name, gif, desc, link }: Props) {

    const openInNewTab = (url: string) => {
        window.open(url, "_blank", "noreferrer")?.focus();
    };

    return (

        <div className="card card-bordered border-black border-2 rounded-none shadow-card max-w-prose bg-base-100 cursor-pointer mx-10 mt-10 z-10" onClick={() => openInNewTab(link)}>
            <figure><img src={gif} alt={name} /></figure>
             <div className="card-body">
                <h2 className="card-title">{name}</h2>
                <p>{desc}</p>
            </div>
        </div>

    );
}

export default Page;