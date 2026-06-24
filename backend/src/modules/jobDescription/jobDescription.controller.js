const JobDescription =
  require(
    "./jobDescription.model"
  );

const extractSkills =
  require(
    "./extractSkills"
  );

const uploadJobDescription =
  async (req, res) => {

    try {

      const {
        company,
        role,
        jdText,
      } = req.body;

      const extracted =
        await extractSkills(
          jdText
        );

      const jobDescription =
        await JobDescription.create({
          userId:
            req.user.userId,

          company,

          role,

          jdText,

          extractedSkills:
            extracted.skills,
        });

      res.status(201).json({
        message:
          "Job Description Processed",

        jobDescription,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "JD Processing Failed",

        error:
          error.message,
      });

    }

  };

const getJobDescriptions =
  async (req, res) => {

    try {

      const jobDescriptions =
        await JobDescription.find({
          userId: req.user.userId,
        }).sort({
          createdAt: -1,
        });

      res.status(200).json({
        jobDescriptions,
      });

    } catch (error) {

      res.status(500).json({
        message:
          "Failed to fetch job descriptions",

        error:
          error.message,
      });

    }

  };

module.exports = {
  uploadJobDescription,
  getJobDescriptions,
};