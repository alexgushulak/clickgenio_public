import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function uploadImageDataToDB(emailAddress, imageId, userPrompt, stableDiffusionPrompt) {
    try {
        await prisma.image.create({
            data: {
                imageId: imageId,
                userPrompt: userPrompt,
                emailAddress: emailAddress,
                stableDiffusionPrompt: stableDiffusionPrompt,
                downloadUrl: `https://clickgenio-production.up.railway.app/download/full?id=${imageId}`,
                previewUrl: `https://clickgenio-production.up.railway.app/download/preview?id=${imageId}`,
                watermarkUrl: `https://clickgenio-production.up.railway.app/download/watermark?id=${imageId}`
            },
        })
        console.log("Image Data Uploaded to DB")
    } catch (err) {
        console.error("Prisma Upload Error", err)
    }
}

export async function getLastNImages(imageCount) {
    try {
        await prisma.$connect()
        const images = await prisma.image.findMany({
            take: imageCount,
            orderBy: {
                createdAt: 'desc'
            }
        })

        return images
    } catch (err) {
        console.error("getLastNImages Error: ", err)
    }
}

export async function markImageAsPurchased(imageID) {
  try {
    const image = await prisma.image.findUnique({
      where: { imageId: imageID },
    });

    if (!image) {
      throw new Error(`Image with imageID ${imageID} not found`);
    }

    // Update the isDownloaded and isPurchased fields to true
    await prisma.image.update({
      where: { imageId: imageID },
      data: {
        isPurchased: true,
      },
    });

    console.log(`Image with imageID ${imageID} marked as purchased.`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

export async function getCreditsByEmail(email) {
  try {
    const user = await prisma.userData.findUnique({
      where: { emailAddress: email }
    });

    if (!user) {
      throw new Error(`User with email address ${email} not found`);
    }

    return user.credits; // Assuming the user data model has a 'credits' field
  } catch (error) {
    console.error(`Error fetching credits for ${email}: ${error.message}`);
  }
}

export async function updateCredits(email, creditAmount) {
  try {
    console.log(email)
    const currentCredits = await getCreditsByEmail(email);

    console.log(currentCredits, creditAmount)

    await prisma.userData.update({
      where: { 
        emailAddress: email,
      }, 
      data: {
        credits: parseInt(currentCredits) + parseInt(creditAmount),
      } 
    });
  } catch (error) {
    console.error(`Error updating credits for ${email}: ${error.message}`);
    throw error;
  }
}

export async function markImageAsDownloaded(imageID) {
  try {
    // Find the image by its imageID
    const image = await prisma.image.findUnique({
      where: { imageId: imageID },
    });

    if (!image) {
      throw new Error(`Image with imageID ${imageID} not found`);
    }

    // Update the isDownloaded and isPurchased fields to true
    await prisma.image.update({
      where: { imageId: imageID },
      data: {
        isDownloaded: true,
      },
    });

    console.log(`Image with imageID ${imageID} marked as downloaded.`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

export async function markCTAClicked(emailAddress) {
  try {
    const session = await prisma.userData.findUnique({
      where: { emailAddress: emailAddress },
    });

    if (!session) {
      throw new Error(`Session with Session ID ${imageID} not found`);
    }

    // Update the isDownloaded and isPurchased fields to true
    await prisma.userData.update({
      where: { emailAddress: emailAddress },
      data: {
        isCTAClicked: true,
      },
    });

  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

export async function getImageCount() {
  try {
    const count = await prisma.image.count();
    return count;
  } catch (error) {
    console.error('Error getting image count:', error);
    throw error;
  }
}

export async function createUserAccount(emailAddress, fullName) {
  try {
    const account = await prisma.userData.findUnique({
      where: { emailAddress: emailAddress },
    });

    if (!account) {
      await prisma.userData.create({
        data: {
          fullName: fullName,
          emailAddress: emailAddress,
          city: 'N/A',
          country: 'N/A'
        },
    })
    }
  } catch (err) {
    console.error("Create User Account Error", err)
  }
}

export async function updateIsEmailOk(emailAddress) {
  try {
    const user = await prisma.userData.findUnique({
      where: { emailAddress: emailAddress },
    });

    if (!user) {
      throw new Error(`User with email address ${emailAddress} not found`);
    }
    await prisma.userData.update({
      where: { emailAddress: emailAddress },
      data: {
        isEmailOk: true,
      },
    });

  } catch (error) {
    console.error(`updateIsEmailOk DB Error: ${error.message}`);
  }
}

export default prisma