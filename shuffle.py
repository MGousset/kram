import os, random, numpy as np
os.chdir("photos")
path =  os.getcwd()
print(path)
files = os.listdir(path)

nbPhotos = len(files)
photosIndex = np.arange(nbPhotos)
suffledIndex = random.shuffle(photosIndex)

for i in range(nbPhotos):
    print(files[i], photosIndex[i])
    os.rename(files[i], str(photosIndex[i])+".jpg")