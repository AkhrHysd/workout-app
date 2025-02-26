import { useState } from "react";
import { SettingsFormProps } from "../types/workout";

const SettingsForm: React.FC<SettingsFormProps> = ({ settings, onSubmit }) => {
  const [formData, setFormData] = useState(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseInt(value, 10),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto">
      <div className="space-y-2">
        <label htmlFor="exerciseTime" className="block text-sm font-medium">
          運動時間（秒）
        </label>
        <input
          type="number"
          id="exerciseTime"
          name="exerciseTime"
          min="1"
          max="300"
          value={formData.exerciseTime}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="restTime" className="block text-sm font-medium">
          休憩時間（秒）
        </label>
        <input
          type="number"
          id="restTime"
          name="restTime"
          min="1"
          max="300"
          value={formData.restTime}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="sets" className="block text-sm font-medium">
          セット数
        </label>
        <input
          type="number"
          id="sets"
          name="sets"
          min="1"
          max="20"
          value={formData.sets}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
      >
        設定を保存
      </button>
    </form>
  );
};

export default SettingsForm;
