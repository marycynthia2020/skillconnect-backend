const { Artisan, User, ArtisanSkill, Skill } = require("../models");
const artisan = require("../models/artisan");
const skill = require("../models/skill");

async function getAllArtisans(req, res, next) {
  const { state, skillId } = req.query;
  if (!skillId) {
    return res.status(400).json({
      success: false,
      message: "Select the service you are looking for",
    });
  }

  try {
    const artisans = await ArtisanSkill.findAll({
      where: { skillId },
      attributes: ["userId"],
      include: [
        {
          model: User,
          as: "user",
          include: [
            {
              model: ArtisanSkill,
              as: "artisanSkills",
              attributes: ["userId"],
              include: [
                {
                  model: Skill,
                  as: "skill",
                  attributes: ["title"],
                },
              ],
            },
          ],

          where: { ...(state && { state }) },
        },
        // {
        //   model: Skill,
        //   as: "skill",
        // },
      ],
    });
    return res.status(200).json({
      success: true,
      message: "Artisans retrieved successfully",
      artisans,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function getASingleArtisanById(req, res, next) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Enter an Id",
    });
  }

  try {
    const artisan = await User.findByPk(id, {
      include: [
        {
          model: Artisan,
          as: "artisan",
          attributes: ["isVerified", "about"],
        },
        {
          model: ArtisanSkill,
          as: "artisanSkills",
          attributes: ["skillId"],
          include: [
            {
              model: Skill,
              as: "skill",
            },
          ],
        },
      ],
    });

    if (!artisan) {
      return res.status(404).json({
        success: false,
        message: "Artisan found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Artisan retrived succesfully",
      artisan,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function updateArtisanDetails(req, res, next) {
  const user = req.user;
  const { about, skills } = req.body;
  if (!about && !skills) {
    return res.status(400).json({
      success: false,
      message: "Details are required",
    });
  }

  if (skills && (!Array.isArray(skills) || skills.length > 3)) {
    return res.status(400).json({
      success: false,
      message: "Maximum of 3 skills allowed",
    });
  }

  const normalizedSkills = skills
    ? skills.map(skill => skill.trim().toLowerCase())
    : [];

  try {
    const artisan = await Artisan.findOne({
      where: { userId: user.id },
    });

    if (about !== undefined) artisan.about = about;
    artisan.save;

    if (normalizedSkills.length > 0) {
      await ArtisanSkill.destroy({
        where: { userId: user.id },
      });
    }

    // create a skill if not existing or find already existing in the skills table
    const skillRecords = await Promise.all(
      normalizedSkills.map(async title => {
        const [skill] = await Skill.findOrCreate({
          where: { title },
        });
        return skill;
      }),
    );

    const artisanSkills = skillRecords.map(skill => ({
      userId: user.id,
      skillId: skill.id,
    }));

    await ArtisanSkill.bulkCreate(artisanSkills);

    // ArtisanSkill.create({userId:, })??

    // skillRecords.forEach(record=>record.forEach(skill =>ArtisanSkill.create({
    //   userId: user.id,
    //   skillId: skill.id
    // })))

    // skillRecords.forEach(record=>record.forEach(skill =>console.log(skill.id)))
    // skillRecords.forEach(skill =>
    //   ArtisanSkill.create({
    //     userId: user.id,
    //     skillId: skill.id,
    //   }),
    // );

    // console.log(skillRecords)skill
    return res.json({
      skillRecords,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

module.exports = {
  updateArtisanDetails,
  getAllArtisans,
  getASingleArtisanById,
};
