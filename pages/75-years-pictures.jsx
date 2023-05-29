const slugify = require("@sindresorhus/slugify");
exports.data = {
  title: "75 Years in Pictures",
};

exports.default = () => (
  <>
    <p class="mb-5">
      These pictures traverse our history of 75 years, beginning in 1924 when
      founder Irving Harris first had the idea of forming the Brown Band.
    </p>
    <Image
      filename="history_01.jpg"
      caption="Our first “Join the Brown Band” flyer, by Irving Harris (October&nbsp;15,&nbsp;1924)."
    />
    <Image
      filename="history_02.jpg"
      caption="An early football season formation (October&nbsp;30,&nbsp;1925)."
    />
    <Image filename="history_03.jpg" caption="The Brown Band of 1926." />
    <Image
      filename="history_04.jpg"
      caption="The Band forms a “Y” in the Yale Bowl, kicking off a longtime tradition (October&nbsp;23,&nbsp;1926)."
    />
    <Image
      filename="history_05.jpg"
      caption="The first woman bandie, as part of a fundraising effort for the Bruin Club (November 14, 1926). In 1968, the band would become one of the first student groups at Brown to become co-ed."
    />
    <Image
      filename="history_06.jpg"
      caption="The Band gets almost-top billing in the Philly newspaper on game day (October 18, 1927)."
    />
    <Image
      filename="history_12.jpg"
      caption="Tough loss to Colgate 35-34 at home on October 28, 1950, but that sure doesn’t dampen the spirits of the Brown Band!"
    />
    <Image
      filename="history_07.jpg"
      caption="An alumni reunion for the Band’s 40th anniversary gave us this formation at the football game. The alumni were in the “B” and the students were in the “ROWN” (October 10, 1964)."
    />
    <Image
      filename="history_08.jpg"
      caption="Our fearless founder, Irving R. Harris ’28, in 1928 and again leading the band at the 50th anniversary celebration in 1974."
    />
    <Image
      filename="history_09.jpg"
      caption="The Brown Band of 1987; the beginning of a legacy that brought us fame and infamy."
    />
    <Image
      filename="history_10.jpg"
      caption="The cover of our Roadtrip album, released in 1987, tells all."
    />
    <Image
      filename="history_11.jpg"
      caption={
        <>
          <p>
            Scott Perrin ’89’s idea to run our mascot, Elrod T. Snidley, in the
            race for President of the Undergraduate Council of Students was met
            with both wide outrage and even wider support across campus.
          </p>
          <p>
            In the election that threatened to undermine students’ faith in UCS,
            Elrod as a write-in candidate won nearly 50% of the vote, a narrow
            margin of victory for the human candidate (April&nbsp;1988).
          </p>
        </>
      }
    />
  </>
);

function Image({ filename, caption }) {
  const src = `/assets/images/75-years/${filename}`;
  return (
    <figure
      class="figure d-flex flex-column col-lg-8 m-auto"
      style="margin-bottom: 3em !important"
    >
      <a href={src} class="mx-auto">
        <img
          loading="lazy"
          class="figure-img img-fluid rounded"
          style="max-height: 500px;"
          src={src}
          alt={caption}
        />
      </a>
      <figcaption class="figure-caption text-center">{caption}</figcaption>
    </figure>
  );
}
