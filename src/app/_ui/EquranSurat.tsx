'use client'

import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  Moon,
  Sun,
  BookOpen,
  MapPin,
  Hash,
  Clock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from './ThemeContext';
import { ThemeToggle } from './ThemeToggle';

// Type definitions
interface AudioUrls {
  [key: string]: string;
}

interface Ayat {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: AudioUrls;
}

interface SuratNavigation {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
}

interface SurahData {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audioFull: AudioUrls;
  ayat: Ayat[];
  suratSelanjutnya: SuratNavigation | false;
  suratSebelumnya: SuratNavigation | false;
}

interface SurahDetailProps {
  surahData: SurahData;
  selectedReciter?: string;
  onNavigateToSurah?: (surahNumber: number) => void;
}

interface CurrentAudio {
  ayatNumber: number;
  audio: HTMLAudioElement;
}

const EquranSurat: React.FC<SurahDetailProps> = ({
  surahData,
  selectedReciter = '01',
  onNavigateToSurah
}) => {
  const [currentAudio, setCurrentAudio] = useState<CurrentAudio | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showTransliteration, setShowTransliteration] = useState<boolean>(true);
  const [autoPlay, setAutoPlay] = useState<boolean>(false);
  const audioRefs = useRef<{ [key: number]: HTMLAudioElement }>({});
  const router = useRouter();
  const { darkMode } = useTheme();

  const reciters: { [key: string]: string } = {
    "01": "Abdullah Al-Juhany",
    "02": "Abdul Muhsin Al-Qasim",
    "03": "Abdurrahman As-Sudais",
    "04": "Ibrahim Al-Dossari",
    "05": "Misyary Rashed Al-Afasy"
  };

  const playAyat = (ayatNumber: number): void => {
    // Stop current audio if playing
    if (currentAudio) {
      currentAudio.audio.pause();
      currentAudio.audio.currentTime = 0;
    }

    const ayat = surahData.ayat.find(a => a.nomorAyat === ayatNumber);
    if (!ayat) return;

    const audioUrl = ayat.audio[selectedReciter];
    if (!audioUrl) return;

    // Create or get audio element
    let audio = audioRefs.current[ayatNumber];
    if (!audio) {
      audio = new Audio(audioUrl);
      audioRefs.current[ayatNumber] = audio;
    }

    audio.muted = isMuted;

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentAudio(null);

      // Auto-play next ayat if enabled
      if (autoPlay && ayatNumber < surahData.jumlahAyat) {
        setTimeout(() => playAyat(ayatNumber + 1), 500);
      }
    };

    const handleError = () => {
      console.error(`Failed to load audio for ayat ${ayatNumber}`);
      setIsPlaying(false);
      setCurrentAudio(null);
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    setCurrentAudio({ ayatNumber, audio });
    setIsPlaying(true);

    audio.play().catch(() => {
      setIsPlaying(false);
      setCurrentAudio(null);
    });
  };

  const pauseAyat = (): void => {
    if (currentAudio) {
      currentAudio.audio.pause();
      setIsPlaying(false);
    }
  };

  const isAyatPlaying = (ayatNumber: number): boolean => {
    return currentAudio?.ayatNumber === ayatNumber && isPlaying;
  };

  const toggleMute = (): void => {
    setIsMuted(!isMuted);
    if (currentAudio) {
      currentAudio.audio.muted = !isMuted;
    }
  };

  const playPreviousAyat = (): void => {
    if (currentAudio && currentAudio.ayatNumber > 1) {
      playAyat(currentAudio.ayatNumber - 1);
    }
  };

  const playNextAyat = (): void => {
    if (currentAudio && currentAudio.ayatNumber < surahData.jumlahAyat) {
      playAyat(currentAudio.ayatNumber + 1);
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white'
        : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-slate-900'
      }`}>
      {/* Header */}
      <div className={`sticky top-0 z-50 backdrop-blur-md transition-colors duration-300 ${darkMode
          ? 'bg-slate-900/90 border-slate-700'
          : 'bg-white/90 border-slate-200'
        } border-b`}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className={`p-2 rounded-xl transition-colors ${darkMode
                    ? 'hover:bg-slate-800 text-slate-300'
                    : 'hover:bg-slate-100 text-slate-600'
                  }`}
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${darkMode
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                  } shadow-lg`}>
                  {surahData.nomor}
                </div>
                <div>
                  <h1 className="text-xl font-bold">{surahData.namaLatin}</h1>
                  <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {surahData.arti}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className={`p-2 rounded-xl transition-colors ${darkMode
                    ? 'hover:bg-slate-800 text-slate-300'
                    : 'hover:bg-slate-100 text-slate-600'
                  }`}
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>

              <ThemeToggle/>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Surah Info Card */}
        <div className={`mb-8 p-6 rounded-2xl ${darkMode
            ? 'bg-slate-800/50 border-slate-700'
            : 'bg-white border-slate-200'
          } border backdrop-blur-sm shadow-lg`}>
          <div className="text-center mb-6">
            <h2 className="text-4xl font-arabic mb-3" dir="rtl">{surahData.nama}</h2>
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className={`flex items-center space-x-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                <Hash className="h-4 w-4" />
                <span>{surahData.jumlahAyat} Ayat</span>
              </div>
              <div className={`flex items-center space-x-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                <MapPin className="h-4 w-4" />
                <span>{surahData.tempatTurun}</span>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-xl mb-4 ${darkMode ? 'bg-slate-700/50' : 'bg-slate-50'
            }`}>
            <div
              className="text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: surahData.deskripsi }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={showTransliteration}
                  onChange={(e) => setShowTransliteration(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span>Show Transliteration</span>
              </label>

              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={autoPlay}
                  onChange={(e) => setAutoPlay(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span>Auto-play Next</span>
              </label>
            </div>

            <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Reciter: <span className="font-medium">{reciters[selectedReciter]}</span>
            </div>
          </div>
        </div>

        {/* Ayat List */}
        <div className="space-y-6">
          {surahData.ayat.map((ayat) => (
            <div
              key={ayat.nomorAyat}
              className={`p-6 rounded-2xl transition-all duration-300 ${isAyatPlaying(ayat.nomorAyat)
                  ? darkMode
                    ? 'bg-emerald-900/30 border-emerald-600'
                    : 'bg-emerald-50 border-emerald-300'
                  : darkMode
                    ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800/70'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                } border backdrop-blur-sm shadow-lg`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${isAyatPlaying(ayat.nomorAyat)
                    ? darkMode
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-500 text-white'
                    : darkMode
                      ? 'bg-slate-700 text-slate-300'
                      : 'bg-slate-100 text-slate-600'
                  } shadow-md`}>
                  {ayat.nomorAyat}
                </div>

                <button
                  onClick={() => isAyatPlaying(ayat.nomorAyat) ? pauseAyat() : playAyat(ayat.nomorAyat)}
                  className={`p-3 rounded-xl transition-all duration-300 ${isAyatPlaying(ayat.nomorAyat)
                      ? darkMode
                        ? 'bg-emerald-600 text-white shadow-lg scale-110'
                        : 'bg-emerald-500 text-white shadow-lg scale-110'
                      : darkMode
                        ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    } shadow-md hover:shadow-lg`}
                >
                  {isAyatPlaying(ayat.nomorAyat) ?
                    <Pause className="h-5 w-5" /> :
                    <Play className="h-5 w-5" />
                  }
                </button>
              </div>

              {/* Arabic Text */}
              <div className="text-right mb-4">
                <p className="text-2xl leading-loose font-arabic" dir="rtl">
                  {ayat.teksArab}
                </p>
              </div>

              {/* Transliteration */}
              {showTransliteration && (
                <div className={`mb-3 p-3 rounded-lg italic ${darkMode ? 'bg-slate-700/30 text-slate-300' : 'bg-slate-50 text-slate-600'
                  }`}>
                  <p className="text-sm">{ayat.teksLatin}</p>
                </div>
              )}

              {/* Indonesian Translation */}
              <div className={`${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                <p className="leading-relaxed">{ayat.teksIndonesia}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Audio Controls */}
        {currentAudio && (
          <div className={`fixed bottom-6 right-6 p-4 rounded-xl shadow-2xl ${darkMode
              ? 'bg-emerald-600/90 text-white'
              : 'bg-emerald-500/90 text-white'
            } backdrop-blur-md shadow-lg`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="animate-pulse">
                  <Volume2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Playing Ayat {currentAudio.ayatNumber}</p>
                  <p className="text-sm opacity-90">{reciters[selectedReciter]}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={playPreviousAyat}
                  disabled={currentAudio.ayatNumber === 1}
                  className="p-2 rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SkipBack className="h-4 w-4" />
                </button>

                <button
                  onClick={isPlaying ? pauseAyat : () => playAyat(currentAudio.ayatNumber)}
                  className="p-2 rounded-lg hover:bg-white/20"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </button>

                <button
                  onClick={playNextAyat}
                  disabled={currentAudio.ayatNumber === surahData.jumlahAyat}
                  className="p-2 rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SkipForward className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-12 flex items-center justify-between">
          {surahData.suratSebelumnya ? (
            <button
              onClick={() => surahData.suratSebelumnya && onNavigateToSurah?.(surahData.suratSebelumnya.nomor)}
              className={`flex items-center space-x-3 p-4 rounded-xl transition-all ${darkMode
                  ? 'bg-slate-800 hover:bg-slate-700 text-white'
                  : 'bg-white hover:bg-slate-50 text-slate-900'
                } border ${darkMode ? 'border-slate-700' : 'border-slate-200'} shadow-lg hover:shadow-xl`}
            >
              <ChevronLeft className="h-5 w-5" />
              <div className="text-left">
                <p className="text-sm opacity-70">Previous</p>
                <p className="font-medium">{surahData.suratSebelumnya.namaLatin}</p>
              </div>
            </button>
          ) : <div />}

          {surahData.suratSelanjutnya && (
            <button
              onClick={() => surahData.suratSelanjutnya && onNavigateToSurah?.(surahData.suratSelanjutnya.nomor)}
              className={`flex items-center space-x-3 p-4 rounded-xl transition-all ${darkMode
                  ? 'bg-slate-800 hover:bg-slate-700 text-white'
                  : 'bg-white hover:bg-slate-50 text-slate-900'
                } border ${darkMode ? 'border-slate-700' : 'border-slate-200'} shadow-lg hover:shadow-xl`}
            >
              <div className="text-right">
                <p className="text-sm opacity-70">Next</p>
                <p className="font-medium">{surahData.suratSelanjutnya.namaLatin}</p>
              </div>
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EquranSurat;