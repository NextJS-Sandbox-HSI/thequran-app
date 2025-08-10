'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun, Play, Pause, Volume2, ChevronRight, Book, MapPin, Hash } from 'lucide-react';

export default function EquranApp({ surahs }: { surahs: Surah[] }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [currentAudio, setCurrentAudio] = useState<CurrentAudio | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedReciter, setSelectedReciter] = useState<string>('01');

type Reciter = { id: string; name: string };

const reciters: Record<string, Reciter> = {
  "01": { id: "Abdullah-Al-Juhany", name: "Abdullah Al-Juhany" },
  "02": { id: "Abdul-Muhsin-Al-Qasim", name: "Abdul Muhsin Al-Qasim" },
  "03": { id: "Abdurrahman-as-Sudais", name: "Abdurrahman As-Sudais" },
  "04": { id: "Ibrahim-Al-Dossari", name: "Ibrahim Al-Dossari" },
  "05": { id: "Misyari-Rasyid-Al-Afasi", name: "Misyary Rashed Al-Afasy" }
};

  // Detect system theme preference on mount
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setDarkMode(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setDarkMode(e.matches);
    };
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Apply theme class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = (): void => {
    setDarkMode(!darkMode);
  };

  const getAudioUrl = (reciterId: string, surahNumber: number) => {
  const paddedNumber = String(surahNumber).padStart(3, "0");
  return `https://equran.nos.wjv-1.neo.id/audio-full/${reciterId}/${paddedNumber}.mp3`;
  };

  const handlePlayAudio = (surahNumber: number): void => {
    if (currentAudio && currentAudio.surah === surahNumber && isPlaying) {
      // Pause current audio
      audioRef.current?.pause();
      setIsPlaying(false);
      setCurrentAudio(null);
    } else {
      // Play new audio
      audioRef.current?.setAttribute("src", getAudioUrl(reciters[selectedReciter].id, surahNumber));
      audioRef.current?.play();
      setCurrentAudio({ surah: surahNumber, reciter: selectedReciter });
      setIsPlaying(true);
    }
  };

  const isCurrentlyPlaying = (surahNumber: number): boolean => {
    return currentAudio?.surah === surahNumber && isPlaying;
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white' 
        : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-slate-900'
    }`}>
      {/* Header */}
      <div className={`sticky top-0 z-50 backdrop-blur-md transition-colors duration-300 ${
        darkMode 
          ? 'bg-slate-900/80 border-slate-700' 
          : 'bg-white/80 border-slate-200'
      } border-b`}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-xl ${
                darkMode 
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600' 
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500'
              } shadow-lg`}>
                <Book className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">القرآن الكريم</h1>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Al-Quran Al-Kareem
                </p>
              </div>
            </div>
            
            <button
              onClick={toggleTheme}
              className={`p-3 rounded-xl transition-all duration-300 ${
                darkMode 
                  ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              } shadow-md hover:shadow-lg`}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Reciter Selection */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className={`p-4 rounded-2xl mb-6 ${
          darkMode 
            ? 'bg-slate-800/50 border-slate-700' 
            : 'bg-white border-slate-200'
        } border backdrop-blur-sm shadow-lg`}>
          <div className="flex items-center space-x-3 mb-3">
            <Volume2 className={`h-5 w-5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
            <h3 className="font-semibold">القارئ - Reciter</h3>
            <audio ref={audioRef} />
          </div>
          <select
            value={selectedReciter}
            onChange={(e) => setSelectedReciter(e.target.value)}
            className={`w-full p-3 rounded-xl border transition-colors duration-200 ${
              darkMode 
                ? 'bg-slate-700 border-slate-600 text-white focus:border-emerald-500' 
                : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-500'
            } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
          >
            {Object.entries(reciters).map(([key, obj]) => (
              <option key={key} value={key}>{obj.name}</option>
            ))}
          </select>
        </div>

        {/* Surah List */}
        <div className="space-y-4">
          {surahs.map((surah) => (
            <div
              key={surah.nomor}
              className={`group p-6 rounded-2xl transition-all duration-300 border ${
                darkMode 
                  ? 'bg-slate-800/50 hover:bg-slate-800/80 border-slate-700 hover:border-slate-600' 
                  : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300'
              } backdrop-blur-sm shadow-lg hover:shadow-xl cursor-pointer`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  {/* Surah Number */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm ${
                    darkMode 
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white' 
                      : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                  } shadow-lg`}>
                    {surah.nomor}
                  </div>

                  {/* Surah Info */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold">{surah.namaLatin}</h3>
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                          darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {surah.arti}
                        </span>
                      </div>
                      <div className="text-2xl font-arabic" dir="rtl">
                        {surah.nama}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm">
                      <div className={`flex items-center space-x-1 ${
                        darkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        <Hash className="h-4 w-4" />
                        <span>{surah.jumlahAyat} Ayat</span>
                      </div>
                      <div className={`flex items-center space-x-1 ${
                        darkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        <MapPin className="h-4 w-4" />
                        <span>{surah.tempatTurun}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Play Button */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handlePlayAudio(surah.nomor)}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      isCurrentlyPlaying(surah.nomor)
                        ? darkMode 
                          ? 'bg-emerald-600 text-white shadow-lg scale-110' 
                          : 'bg-emerald-500 text-white shadow-lg scale-110'
                        : darkMode 
                          ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    } shadow-md hover:shadow-lg`}
                  >
                    {isCurrentlyPlaying(surah.nomor) ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}
                  </button>
                  <ChevronRight className={`h-5 w-5 transition-transform duration-200 group-hover:translate-x-1 ${
                    darkMode ? 'text-slate-500' : 'text-slate-400'
                  }`} />
                </div>
              </div>

              {/* Description */}
              <div className={`mt-4 pt-4 border-t text-sm leading-relaxed ${
                darkMode ? 'border-slate-700 text-slate-400' : 'border-slate-200 text-slate-600'
              }`} dangerouslySetInnerHTML={{ __html: surah.deskripsi }} />
            </div>
          ))}
        </div>
      </div>

      {/* Audio Player Notification */}
      {currentAudio && isPlaying && (
        <div className={`fixed bottom-6 right-6 p-4 rounded-xl shadow-2xl ${
          darkMode 
            ? 'bg-emerald-600 text-white' 
            : 'bg-emerald-500 text-white'
        } backdrop-blur-md border border-white/20`}>
          <div className="flex items-center space-x-3">
            <div className="animate-pulse">
              <Volume2 className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">Now Playing</p>
              <p className="text-sm opacity-90">
                {surahs.find(s => s.nomor === currentAudio.surah)?.namaLatin} - {reciters[currentAudio.reciter]?.name}
              </p>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
};