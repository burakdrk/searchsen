import Switch from "~components/ui/Switch";
import logo from "data-base64:assets/icon.png";
import { FaGithub } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { Storage } from "@plasmohq/storage";
import { useStorage } from "@plasmohq/storage/hook";

function Settings() {
  const [emotesOn, setEmotesOn] = useStorage({
    key: "emotesOn",
    instance: new Storage({
      area: "local"
    })
  });

  const [twitchFallback, setTwitchFallback] = useStorage({
    key: "twitchFallback",
    instance: new Storage({
      area: "local"
    })
  });

  return (
    <div className="text-2xl">
      <h1 className="text-4xl font-bold">Settings</h1>

      <div className="py-8 space-y-12">
        {/* Switches Section */}
        <section>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <label htmlFor="emotesOn">
                Show Emotes
                <br />
                <em className="text-xl">(may decrease performance)</em>
              </label>
              <Switch
                id="emotesOn"
                onChange={() => {
                  setEmotesOn(!emotesOn);
                }}
                checked={emotesOn}
              />
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="twitchFallback">
                Fallback to Twitch API
                <br />
                <em className="text-xl">(slow and limited emote support)</em>
              </label>
              <Switch
                id="twitchFallback"
                onChange={() => {
                  setTwitchFallback(!twitchFallback);
                }}
                checked={twitchFallback}
              />
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="pt-8 border-t">
          <div className="flex flex-col items-center text-center space-y-4">
            <img src={logo} alt="Logo" className="w-24 h-24" />
            <div>
              <h3 className="text-xl font-semibold">Searchsen</h3>
              <p className="text-gray-600 dark:text-gray-400">4.0.0</p>
            </div>
            <div className="flex gap-4">
              <a
                href="https://github.com/burakdrk/searchsen"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline flex gap-2 flex-row items-center"
              >
                <FaGithub className="w-6 h-6" />
                Source Code
              </a>
              <a
                href="mailto:bduruk@proton.me"
                className="hover:underline flex gap-2 flex-row items-center"
              >
                <IoMail className="w-6 h-6" />
                Contact
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Settings;
