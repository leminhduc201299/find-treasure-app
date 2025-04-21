export interface TreasureMap {
  id: number;
  n: number;
  m: number;
  p: number;
  result: number;
  createdAt: string;
  updatedAt: string;
  matrices?: Matrix[];
}

export interface Matrix {
  id: number;
  treasureMapId: number;
  rowIndex: number;
  columnIndex: number;
  value: number;
  createdAt: string;
  updatedAt: string;
}

export interface CalculateRequest {
  n: number;
  m: number;
  p: number;
  grid: number[][];
}

export interface CalculateResponse {
  id: number;
  result: number;
} 