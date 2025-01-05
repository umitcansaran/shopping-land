// Append the AWS S3 bucket URL to image paths
function addToImagePath(arr, baseUrl) {
  return arr.map((obj) => {
    // Helper function to conditionally append the baseUrl
    const appendBaseUrl = (path) =>
      path && !path.startsWith(baseUrl) ? baseUrl + path : path;

    // Process direct properties
    if (obj.hasOwnProperty("image")) {
      obj.image = appendBaseUrl(obj.image);
    }
    if (obj.hasOwnProperty("profile_image")) {
      obj.profile_image = appendBaseUrl(obj.profile_image);
    }

    // Process nested `product.image` property
    if (obj.product && obj.product.hasOwnProperty("image")) {
      obj.product.image = appendBaseUrl(obj.product.image);
    }

    return obj;
  });
}

module.exports = { addToImagePath };
