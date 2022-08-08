/* eslint-disable prettier/prettier */
const axios = require('axios').default;
const htmlParser = require('node-html-parser');

const cdnUrl = `${process.env.cdn_uri}`;

exports.home = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'ok',
  });
};

exports.recentRelease = async (req, res, page = 1, liArr = []) => {
  try {
    const resp = await axios.get(
      `${cdnUrl}ajax/page-recent-release.html?${page}`
    );

    // TODO: Parse HTML to JSON
    const root = htmlParser.parse(resp.data);
    const ul = root.querySelector('.items');

    let a;
    let aType;
    let epLink;
    let anTitle;
    let anSrc;

    ul.childNodes.forEach((el) => {
      if (el.rawTagName === 'li') {
        el.childNodes.forEach((liChild) => {
          let epNo;
          if (liChild.rawTagName === 'div') {
            liChild.childNodes.forEach((divChild) => {
              if (divChild.rawTagName === 'a') {
                divChild.childNodes.forEach((aTag) => {
                  if (aTag.rawTagName === 'img') {
                    a = aTag.rawAttrs;
                  } else if (aTag.rawTagName === 'div') {
                    aType = aTag.rawAttrs.includes('SUB') ? 'SUB' : 'DUB';
                  }
                });
                // Var Defined
                epLink = `${divChild.rawAttrs
                  .split(' title')[0]
                  .replace(/['"]+/g, '')
                  .replace('href=', '')}`;
                anTitle = `${divChild.rawAttrs
                  .split(' title')[1]
                  .replace(/['"=]+/g, '')}`;
                anSrc = `${a
                  .split(' alt')[0]
                  .replace('src=', '')
                  .replace(/["]+/g, '')}`;
              }
            });
          }
          if (liChild.rawTagName === 'p') {
            liChild.childNodes.forEach((pEle) => {
              if (pEle.nodeType === 3) {
                epNo = pEle._rawText;
              }
            });
          }
          if (epLink && anTitle && anSrc && aType && epNo) {
            liArr.push({
              episodeLink: epLink,
              animeTitle: anTitle,
              animeImgSrc: anSrc,
              animeType: aType,
              episodeNum: epNo,
            });
          }
        });
      }
    });
    res.status(200).json({
      data: {
        liArr,
      },
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};
