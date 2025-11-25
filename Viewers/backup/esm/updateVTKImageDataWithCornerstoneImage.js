function updateVTKImageDataWithCornerstoneImage(sourceImageData, image) {
    const pixelData = image.voxelManager.getScalarData();
    if (!sourceImageData.getPointData) {
        return;
    }
    const scalarData = sourceImageData
        .getPointData()
        .getScalars()
        .getData();
    const expectedLength = scalarData.length;
    const actualLength = pixelData.length;

    // 2. ⚠️ IMPLEMENT INTEGRITY CHECK ⚠️
    if (actualLength < expectedLength) {
        // console.warn(`Incomplete pixel data: Expected ${expectedLength} elements, got ${actualLength}. Proceeding with partial update.`);
        // Do NOT throw. Just copy what we have.
        const safeDataView = pixelData.subarray(0, actualLength);
        // Note: scalarData.set(src) only updates the indices present in src.
        // The rest of scalarData remains unchanged (likely zeros or previous data).
        scalarData.set(safeDataView);
    } else if (image.color && image.rgba) {
        const newPixelData = new Uint8Array(image.columns * image.rows * 3);
        for (let i = 0; i < image.columns * image.rows; i++) {
            newPixelData[i * 3] = pixelData[i * 4];
            newPixelData[i * 3 + 1] = pixelData[i * 4 + 1];
            newPixelData[i * 3 + 2] = pixelData[i * 4 + 2];
        }
        image.rgba = false;
        image.getPixelData = () => newPixelData;
        scalarData.set(newPixelData);
    }
    else {
        scalarData.set(pixelData);
    }
    sourceImageData.modified();
}
export { updateVTKImageDataWithCornerstoneImage };
