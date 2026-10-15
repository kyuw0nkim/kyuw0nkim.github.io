/** Where each character sits. Characters are Tracing targets. */
export interface CharacterSpec {
  id: string;
  label: string;
  position: [number, number, number];
  rotationY: number;
  /** Where the hover label and the "conversation" lines attach (world space). */
  anchor: [number, number, number];
}

export const CAST: CharacterSpec[] = [
  { id: "ghost", label: "White", position: [-0.14, 0.38, -1.62], rotationY: 0.1, anchor: [-0.14, 2.08, -1.56] },
  { id: "clover", label: "Clover", position: [-1.42, 0.46, 0.3], rotationY: 1.0, anchor: [-1.38, 1.62, 0.3] },
  { id: "star", label: "Star", position: [1.2, 0.5, -0.92], rotationY: -0.8, anchor: [1.17, 1.76, -0.9] },
  { id: "lavender", label: "Lavender", position: [1.06, 0.52, 0.9], rotationY: -1.1, anchor: [1.05, 1.36, 0.9] },
];
