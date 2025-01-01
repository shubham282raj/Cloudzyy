export const customLogging = (req, res, next) => {
  if (req.url != "/") console.log(req.url);
  next();
};
