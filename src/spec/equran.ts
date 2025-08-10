
interface AudioFull {
  [key: string]: string;
}

interface Surah {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audioFull: AudioFull;
}

interface CurrentAudio {
  surah: number;
  reciter: string;
}

interface Reciters {
  [key: string]: string;
}