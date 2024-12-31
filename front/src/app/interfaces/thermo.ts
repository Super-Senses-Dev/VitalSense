export interface Thermo {
    id: string
    imgBase64: string,
    temperature?: number,
    measureDate: Date,
    isDetected: boolean,
    createdAt: Date,
    updatedAt: Date,
    isManual: boolean,
}
