import WorkoutContainer from "./containers/WorkoutContainer";
import SpotifyController from "./components/SpotifyController";

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="order-2 md:order-1">
            <WorkoutContainer />
          </div>
          <div className="order-1 md:order-2">
            <div className="sticky top-4">
              <h2 className="text-xl font-semibold mb-4">音楽プレイヤー</h2>
              <SpotifyController />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
