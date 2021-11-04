
export interface Gallery {
  id: string;
  name: string;
  description: string;
  coverImage: string | null;
  images?: Image[];
}

export interface  Dimensions {
  width: number;
  height: number;
}

export interface Image {
  id: string;
  dimensions: Dimensions;
  original_url: string;
  optimized_url: string;
  thumbnail_url: string;
}
