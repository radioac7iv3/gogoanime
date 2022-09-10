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

exports.recentRelease = async (req, res, next, page = 1, liArr = []) => {
  try {
    // TODO:
    const resp = await axios.get(
      `${cdnUrl}ajax/page-recent-release.html?${page}`
    );

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
                // Var Define
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

exports.popularOngoing = async (req, res, next, page = 1, finalArr = []) => {
  try {
    const resp = await axios.get(
      `${cdnUrl}ajax/page-recent-release-ongoing.html?page=${page}`
    );
    const root = htmlParser.parse(resp.data);

    // Wrapping All Li Inside NodeList [li1, li2, li3, li4]
    const liArray = root.querySelectorAll(
      'div.added_series_body.popular > ul > li'
    );

    const anonArr = [];
    liArray.forEach((li) => {
      // Making an Array of Li Ele
      const tempArr = [];
      li.childNodes.forEach((el) => {
        if (el.nodeType === 1) {
          tempArr.push(el);
        }
      });
      anonArr.push(tempArr);
    });
    // When Anon Array is complete
    // 1) [[{a}, {a}, {p}, {p}], [], [], [], []]
    anonArr.forEach((arr) => {
      // [{a}, {a}, {p}, {p}]
      let animeSrc;
      let animeImgSrc;
      let animeTitle;
      let animeGenre;
      let latestEp;

      arr.forEach((el, i) => {
        if (i === 0) {
          el.childNodes.forEach((aChild) => {
            if (aChild.rawTagName === 'div') {
              animeImgSrc = aChild.attributes.style;
            }
          });
        }
        if (i === 1) {
          animeTitle = el.textContent.trim();
          animeSrc = el.attributes.href;
        }

        if (i === 2) {
          animeGenre = [];
          el.childNodes.forEach((pChild) => {
            if (pChild.nodeType === 1) {
              animeGenre.push(pChild.attributes.title);
            }
          });
        }

        if (i === 3) {
          el.childNodes.forEach((pChild) => {
            if (pChild.nodeType === 1) {
              latestEp = pChild.textContent;
            }
          });
        }

        if (animeSrc && animeImgSrc && animeTitle && animeGenre && latestEp) {
          finalArr.push({
            animeSrc,
            animeImgSrc,
            animeTitle,
            animeGenre,
            latestEp,
          });
        }
      });
    });

    res.status(200).json({
      status: 'success',
      data: {
        finalArr,
      },
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};
