import "../styles/index.css";
import logo from "data-base64:assets/icon.png";
import location from "data-base64:assets/location.png";

const UpdatePage = () => {
  const updates = [
    {
      title: "New UI",
      description: "Redesigned the extension to be more user friendly."
    },
    {
      title: "Emote support",
      description: "Added support for third party and twitch emotes."
    },
    {
      title: "Stream Stats",
      description: "Added a new page to view stream stats."
    },
    {
      title: "More channels",
      description:
        "Now the extensions uses multiple justlog instances for a broader support."
    },
    {
      title: "Firefox support",
      description: "Added support for Firefox based browsers.",
      link: "https://addons.mozilla.org/en-US/firefox/addon/searchsen/"
    }
  ];

  return (
    <div className="bg-darker text-white font-sans p-8 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <img src={logo} alt="Logo" className="w-16 h-16" />
        <h1 className="text-center text-3xl">Searchsen updated to 4.0.0</h1>
        <div></div>
      </div>
      <div className="flex">
        <ul className="space-y-8 w-3/5">
          {updates.map((update, index) => (
            <li key={index} className="border-b border-gray-700 pb-8">
              <h2 className="text-xl">{update.title}</h2>
              <p className="text-base mt-2">{update.description}</p>
              {update.link && (
                <a
                  href={update.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {update.link}
                </a>
              )}
            </li>
          ))}
        </ul>
        <div className="w-2/5 flex flex-col items-center">
          <h2 className="text-2xl text-center mb-2">
            New location for the button
          </h2>
          <img
            src={location}
            alt="Location"
            className="block max-h-[700px] mx-auto"
          />
        </div>
      </div>

      <footer className="text-center">
        <h2 className="text-2xl mb-5 mt-10">Found bugs?</h2>
        <h3 className="text-xl">
          Please report them{" "}
          <a
            href="https://github.com/burakdrk/searchsen"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            here
          </a>
        </h3>
      </footer>
    </div>
  );
};

export default UpdatePage;
