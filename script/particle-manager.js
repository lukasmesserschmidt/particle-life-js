import { getRandomColor } from "./utils.js";

export class ParticleManager {
  constructor() {
    this.groups = [];
  }

  // getters
  get groupCount() {
    return this.groups.length;
  }

  get particlesPerGroup() {
    return this.groupCount ? this.groups[0][1].length : 0;
  }

  // updater and creator
  getNewGroup(particleCount) {
    // [color, particles, relations]
    const group = [];

    // get group color
    const color = getRandomColor();

    // create particle list
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      const particle = this.getNewParticle(
        Math.random() * innerWidth,
        Math.random() * innerHeight
      );
      particles.push(particle);
    }

    // add to group
    group.push(color);
    group.push(particles);
    group.push([]);

    return group;
  }

  updateGroupCount(groupCount, particleCount, minRelation, maxRelation) {
    const groupCountDelta = groupCount - this.groupCount;

    // add group
    if (groupCountDelta > 0) {
      for (let i = 0; i < groupCountDelta; i++) {
        const newGroup = this.getNewGroup(this.particlesPerGroup);
        this.groups.push(newGroup);
      }
    }

    // remove group
    else if (groupCountDelta < 0) {
      for (let i = 0; i < -groupCountDelta; i++) {
        this.groups.pop();
      }
    }

    // update relations and particle count
    this.updateRelations(minRelation, maxRelation);
    this.updateParticleCount(particleCount);
  }

  getNewRelation(relationScale, minRelation, maxRelation) {
    const relation = relationScale * (maxRelation - minRelation) + minRelation;

    return relation;
  }

  updateRelations(minRelation, maxRelation) {
    for (const group of this.groups) {
      const relationCountDelta = this.groupCount - group[2].length;

      // add
      if (relationCountDelta > 0) {
        for (let i = 0; i < relationCountDelta; i++) {
          const newRelation = this.getNewRelation(
            Math.random(),
            minRelation,
            maxRelation
          );
          group[2].push(newRelation);
        }
      }

      // remove
      else if (relationCountDelta < 0) {
        for (let i = 0; i < -relationCountDelta; i++) {
          group[2].pop();
        }
      }
    }
  }

  getNewParticle(x, y, vx = 0, vy = 0) {
    return [x, y, vx, vy];
  }

  updateParticleCount(particleCount) {
    const particlesPerGroup = Math.floor(particleCount / this.groupCount);

    for (const group of this.groups) {
      const particlesPerGroupDelta = particlesPerGroup - group[1].length;

      // add particle
      if (particlesPerGroupDelta > 0) {
        for (let i = 0; i < particlesPerGroupDelta; i++) {
          const newParticle = this.getNewParticle(
            Math.random() * innerWidth,
            Math.random() * innerHeight
          );
          group[1].push(newParticle);
        }
      }

      // remove particle
      else if (particlesPerGroupDelta < 0) {
        for (let i = 0; i < -particlesPerGroupDelta; i++) {
          group[1].pop();
        }
      }
    }
  }

  // options
  randomColors() {
    for (const group of this.groups) {
      group[0] = getRandomColor();
    }
  }

  randomPositions() {
    for (const group of this.groups) {
      for (const particle of group[1]) {
        particle[0] = Math.random() * innerWidth;
        particle[1] = Math.random() * innerHeight;
      }
    }
  }

  randomRelations(minRelation, maxRelation) {
    for (const group of this.groups) {
      for (let i = 0; i < group[2].length; i++) {
        const relation = this.getNewRelation(
          Math.random(),
          minRelation,
          maxRelation
        );

        group[2][i] = relation;
      }
    }
  }

  // simulation
  simulate(relationScale, friction, cohesion, range, canvas) {
    for (const primaryGroup of this.groups) {
      let relationIndex = 0;

      for (const secundaryGroup of this.groups) {
        // get relation
        const relation = primaryGroup[2][relationIndex] * relationScale;

        for (const primaryParticle of primaryGroup[1]) {
          // get primary particle
          const px = primaryParticle[0];
          const py = primaryParticle[1];
          let vxc = 0;
          let vyc = 0;
          let vx = 0;
          let vy = 0;
          let relationCount = 0;

          for (const secundaryParticle of secundaryGroup[1]) {
            // get secundary particle
            const sx = secundaryParticle[0];
            const sy = secundaryParticle[1];

            // get distance
            let dx = sx - px;
            let dy = sy - py;

            // wrap dist around canvas
            dx = dx - Math.round(dx / canvas.width) * canvas.width;
            dy = dy - Math.round(dy / canvas.height) * canvas.height;
            let dist = Math.sqrt(dx * dx + dy * dy);

            // add force
            if (dist <= range) {
              dist = Math.max(dist, 0.001);

              vxc += (dx / dist) * -cohesion;
              vyc += (dy / dist) * -cohesion;

              vx += dx;
              vy += dy;

              relationCount++;
            }
          }

          // apply relation
          vx = vxc + vx * relation;
          vy = vyc + vy * relation;

          // apply force
          relationCount = Math.max(relationCount, 1);
          primaryParticle[2] =
            (primaryParticle[2] + vx / relationCount) * friction;
          primaryParticle[3] =
            (primaryParticle[3] + vy / relationCount) * friction;

          // update position
          primaryParticle[0] += primaryParticle[2];
          primaryParticle[1] += primaryParticle[3];

          // wrap position around canvas
          primaryParticle[0] =
            (primaryParticle[0] + canvas.width) % canvas.width;
          primaryParticle[1] =
            (primaryParticle[1] + canvas.height) % canvas.height;
        }

        relationIndex++;
      }
    }
  }
  drawParticles(context, radius) {
    for (const group of this.groups) {
      const color = group[0];

      for (const particle of group[1]) {
        const x = particle[0];
        const y = particle[1];

        // draw particle
        context.fillStyle = color;
        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI);
        context.fill();
      }
    }
  }
}
