export const environment = {
  production: true,
  allowedMimeTypes: [
    /* 'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/jpg',
    'image/png' */
  ],
  allowedFileTypes: [
    '.gpkg',
    '.kml',
    '.geojson',
    '.shp',
    '.prj',
    '.dbf',
    '.cpg',
    '.shx',
  ],
  appMaxFileSize: 5, // Tamaño en MB
};
