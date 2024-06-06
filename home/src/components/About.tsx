function About() {
    return (
        <div className="hero max-w-full bg-base-100 my-10">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left mx-10">
                    <h1 className="text-5xl font-bold">Hello! I'm Connor</h1>
                    <p className="py-6">Thanks for taking the time to check out cornbread.games, my personal site where I put my coding projects.
                        If you'd like to get in contact with me, feel free to fill out the form!</p>
                </div>
                <div className="card shrink-0 w-full max-w-md card-bordered border-black border-2 rounded-none shadow-card bg-base-100">
                    <form className="card-body" action="src/send_email.php" method="post">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Name</span>
                            </label>
                            <input type="name" className="input input-bordered input-accent rounded-none" required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input type="email" className="input input-bordered input-accent rounded-none" required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Message</span>
                            </label>
                            <textarea className="textarea textarea-accent rounded-none" />
                        </div>
                        <div className="form-control mt-6">
                            <button className="btn btn-accent">Send</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default About;