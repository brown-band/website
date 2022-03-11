const { createElement } = require("eleventy-hast-jsx");

const CryptoWall = require("../components/CryptoWall");
const Toc = require("../components/Toc");
const TocButton = require("../components/TocButton");

exports.data = {
  title: "Recordings",
  summary:
    "The Brown Band is best known for its scrambling, its skating, and its satire, but few people realize that we are also the only student group to carry on many traditions of Brown that would have otherwise been lost. Most important of these traditions are Brown songs, which were composed upwards of a century ago. Today, the Brown Band brings this music out of commencement ceremonies and alumni reunions and into sporting events and campus marches where they can be heard and enjoyed all over Rhode Island.",
};

exports.default = ({ site: { urls } }) => (
  <>
    <link rel="stylesheet" href="/assets/css/recordings.css" />

    <div id="root">
      <CryptoWall />
    </div>

    <div class="player-wrapper" hidden>
      <div class="player bg-body border">
        <audio controls style="width: 100%" />
        <progress style="width: 100%" hidden />
        <div
          class="d-flex align-items-center mt-2 mt-sm-3"
          style="min-height: 2em"
        >
          <span class="flex-fill">
            {"Now "}
            <span class="player-status">Playing</span>
            {": "}
            <span class="now-playing" style="font-weight: bold">
              ???
            </span>
          </span>
          <button
            type="button"
            class="btn-close ms-3 stop-player"
            aria-label="Stop Playing"
            style="margin-top: -0.25em"
          />
        </div>
      </div>
    </div>

    <template id="trackList">
      <section>
        <h2 />
        <p />
        <table class="table">
          <thead>
            <tr>
              <th>Title</th>
              <th class="arranger-title">Arranger</th>
              <th style="width: 60px" />
            </tr>
          </thead>
          <tbody />
        </table>
      </section>
    </template>

    <template id="trackList-header">
      <tr>
        <th class="text-center" />
      </tr>
    </template>

    <template id="trackList-track">
      <tr>
        <td class="track-title" />
        <td class="track-arranger" />
        <td>
          <button class="btn btn-secondary btn-sm">Play!</button>
        </td>
      </tr>
    </template>

    <template id="toc">
      <Toc toc={[]} />
    </template>
    <template id="toc-button">
      <TocButton />
    </template>
    <template id="toc-li">
      <li>
        <a />
      </li>
    </template>

    <script src="/assets/vendor/base64-arraybuffer.umd.js" />
    <script>globalThis.mediaHost = new URL("{urls.recordings}");</script>
    <script type="module" src="/assets/js/handle-password.js" />
    <script type="module" src="/assets/js/recordings.js" />
  </>
);
