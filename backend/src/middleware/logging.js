export const customLogging = (req, res, next) => {
  console.log(req.url);
  next();
};
