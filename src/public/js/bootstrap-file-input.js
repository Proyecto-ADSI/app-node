// $("#input-ficons-5").fileinput({
// //   uploadUrl: "/file-upload-batch/2",
// //   uploadAsync: false,
//   previewFileIcon: '<i class="fas fa-file"></i>',
//   preferIconicPreview: true, // this will force thumbnails to display icons for following file extensions
//   previewFileIconSettings: {
//     // configure your icon file extensions
//     doc: '<i class="fas fa-file-word text-primary"></i>',
//     xls: '<i class="fas fa-file-excel text-success"></i>',
//     ppt: '<i class="fas fa-file-powerpoint text-danger"></i>',
//     pdf: '<i class="fas fa-file-pdf text-danger"></i>',
//     zip: '<i class="fas fa-file-archive text-muted"></i>',
//     htm: '<i class="fas fa-file-code text-info"></i>',
//     txt: '<i class="fas fa-file-text text-info"></i>',
//     mov: '<i class="fas fa-file-movie-o text-warning"></i>',
//     mp3: '<i class="fas fa-file-audio text-warning"></i>',
//     // note for these file types below no extension determination logic
//     // has been configured (the keys itself will be used as extensions)
//     jpg: '<i class="fas fa-file-image text-danger"></i>',
//     gif: '<i class="fas fa-file-image text-warning"></i>',
//     png: '<i class="fas fa-file-image text-primary"></i>',
//   },
//   previewFileExtSettings: {
//     // configure the logic for determining icon file extensions
//     doc: function (ext) {
//       return ext.match(/(doc|docx)$/i);
//     },
//     xls: function (ext) {
//       return ext.match(/(xls|xlsx)$/i);
//     },
//     ppt: function (ext) {
//       return ext.match(/(ppt|pptx)$/i);
//     },
//     zip: function (ext) {
//       return ext.match(/(zip|rar|tar|gzip|gz|7z)$/i);
//     },
//     htm: function (ext) {
//       return ext.match(/(htm|html)$/i);
//     },
//     txt: function (ext) {
//       return ext.match(/(txt|ini|csv|java|php|js|css)$/i);
//     },
//     mov: function (ext) {
//       return ext.match(/(avi|mpg|mkv|mov|mp4|3gp|webm|wmv)$/i);
//     },
//     mp3: function (ext) {
//       return ext.match(/(mp3|wav)$/i);
//     },
//   },
// });

$(function () {
  $("#Documentos_Soporte").fileinput({
    theme: "fas",
    language: "es",
    uploadUrl: "#",
    allowedFileExtensions: ["jpg", "png", "pdf"],
  });
//   $("#Documentos_Soporte").fileinput();

});
