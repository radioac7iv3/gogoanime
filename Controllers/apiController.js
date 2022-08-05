/* eslint-disable prettier/prettier */
const axios = require('axios').default;
const fs = require('fs');
const htmlParser = require('node-html-parser');

const cdnUrl = `${process.env.cdn_uri}`;

exports.home = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'ok',
  });
};

exports.recentRelease = async (req, res, page = 1) => {
  try {
    const resp = await axios.get(
      `${cdnUrl}ajax/page-recent-release.html?${page}`
    );
    // fs.writeFile('test.html', resp.data, () => {
    //   console.log('file written');
    // });
    // TODO: Parse HTML to JSON
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};
