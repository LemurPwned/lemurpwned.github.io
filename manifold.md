#### Manifold

We compared manifold algorithms on a following 3d shape:

![](images/m5.png)

As seen, it is clear that we simply obtain "unrolling of the shape" in the end, but
the results vary depending on the algorithm
![](images/m4.png)
![](images/m3.png)
![](images/m2.png)

The image below presents the different "perspectives" of the original images
and was obtained by tweaking various parameters like number of neighbours.
Points on the image were actually calculated using LLE, by feeding in the images displayed
as annotations. There is some logical structure to the clustering - similar shaped are grouped together and
the transistions between them also are logically presented.
![](images/m1.png)
