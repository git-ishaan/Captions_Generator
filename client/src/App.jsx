import { useState, useRef } from "react";
import ReactPlayer from "react-player";
import { Dialog } from "@headlessui/react";

function App() {
  const [url, setUrl] = useState("");
  const [captions, setCaptions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentCaption, setCurrentCaption] = useState("");
  const playerRef = useRef();

  const handleAddCaption = () => {
    setCaptions([...captions, { text: "", startTime: 0, endTime: 0 }]);
  };

  const handleCaptionChange = (index, field, value) => {
    const updatedCaptions = captions.map((caption, idx) => {
      if (idx === index) {
        return { ...caption, [field]: value };
      }
      return caption;
    });
    setCaptions(updatedCaptions);
  };

  const handleProgress = ({ playedSeconds }) => {
    const activeCaption = captions.find(
      (caption) =>
        playedSeconds >= caption.startTime && playedSeconds <= caption.endTime
    );
    setCurrentCaption(activeCaption ? activeCaption.text : "");
  };

  const handleSubmit = async () => {
    try {
      await fetch(`${import.meta.env.VITE_APP_URL}/api/video`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, captions }),
      });
      setModalOpen(false);
    } catch (error) {
      console.error("Error saving video data", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 p-4">
      <input
        type="text"
        placeholder="Paste YouTube video link here"
        className="input input-bordered input-primary w-full max-w-lg mb-8"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button
        className="btn btn-primary my-4"
        onClick={() => setModalOpen(true)}
      >
        Add Captions Here
      </button>
      <ReactPlayer
        url={url}
        ref={playerRef}
        controls
        onProgress={handleProgress}
      />
      <div className="absolute bottom-10 text-white text-center p-2 bg-black/50 w-full">
        {currentCaption}
      </div>

      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        className="relative z-50"
      >
        <Dialog.Panel className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <button
              className="absolute top-2 right-2"
              onClick={() => setModalOpen(false)}
            >
              X
            </button>
            <Dialog.Title className="font-bold text-lg">
              Add Some Captions
            </Dialog.Title>
            {captions.map((caption, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 my-2">
                <input
                  type="text"
                  placeholder="Caption text"
                  className="input input-bordered col-span-2"
                  value={caption.text}
                  onChange={(e) =>
                    handleCaptionChange(index, "text", e.target.value)
                  }
                />
                <input
                  type="number"
                  placeholder="Start Time (s)"
                  className="input input-bordered"
                  value={caption.startTime}
                  onChange={(e) =>
                    handleCaptionChange(
                      index,
                      "startTime",
                      parseFloat(e.target.value)
                    )
                  }
                />
                <input
                  type="number"
                  placeholder="End Time (s)"
                  className="input input-bordered"
                  value={caption.endTime}
                  onChange={(e) =>
                    handleCaptionChange(
                      index,
                      "endTime",
                      parseFloat(e.target.value)
                    )
                  }
                />
              </div>
            ))}
            <button
              className="btn btn-secondary mt-2"
              onClick={handleAddCaption}
            >
              Add Captions
            </button>
            <button className="btn btn-success mt-2" onClick={handleSubmit}>
              Save Caption
            </button>
          </div>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
}

export default App;
