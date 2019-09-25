const Campground = require('./models/campground');

const Comment = require('./models/comment');

const campgroundData = [
  {
    name: 'Moose Creek',
    img: 'https://source.unsplash.com/1280x720/?campground',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ipsum ligula, iaculis et elit ut, ultricies ultrices sem. Curabitur ex sapien, maximus rutrum elit tincidunt, tempor varius ipsum. Sed vel pretium ex, et blandit nibh. Integer eu dignissim enim. Integer nec diam in nisi rhoncus sollicitudin. Aenean rutrum condimentum condimentum. Nunc et lorem id mi commodo viverra. Cras id velit placerat, molestie massa in, dictum est. Mauris lobortis nulla finibus ante pretium laoreet. Nullam ullamcorper sagittis nisl efficitur scelerisque. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Vestibulum interdum, neque id auctor condimentum, purus nisi vestibulum elit, quis commodo tortor justo sed eros. Curabitur diam mi, varius quis lacinia id, tempor luctus ipsum. Morbi neque tellus, varius id porttitor in, bibendum ut nibh. Aliquam vitae luctus eros, quis tempor leo.',
  },
  {
    name: 'Cloud`s Rest',
    img: 'https://source.unsplash.com/1280x720/?campground,lake',
    description:
      'Quisque eu tellus lacus. Suspendisse ullamcorper nisi nisl, vel rutrum nisi iaculis vitae. Nam diam sapien, euismod nec velit in, facilisis fermentum elit. Mauris a luctus est. Proin maximus tellus maximus, viverra risus eget, sodales mauris. Pellentesque non leo tempor, aliquam felis quis, iaculis mauris. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Quisque efficitur hendrerit molestie. Aliquam ipsum nulla, interdum in hendrerit id, hendrerit et nisl. Maecenas maximus justo ut tellus egestas, ac eleifend eros tempor. Aliquam aliquam urna id cursus iaculis.',
  },
  {
    name: 'Laky Lake',
    img: 'https://source.unsplash.com/1280x720/?lake',
    description:
      'Donec id libero ut tellus efficitur rhoncus. Nam massa ipsum, pellentesque id pharetra aliquet, pulvinar sed sapien. Maecenas felis felis, vehicula et feugiat a, faucibus at felis. Maecenas in ex a lacus varius dapibus. Fusce scelerisque lorem eu diam egestas varius. Integer vehicula varius ex non vulputate. Donec tincidunt convallis lacus, nec aliquam massa porttitor ut. Fusce in ipsum quis mi varius viverra faucibus vitae ex. Phasellus sagittis turpis nec efficitur viverra. Nulla ut augue sed nibh cursus suscipit. Ut blandit aliquet turpis, eu lacinia dui sodales vitae.',
  },
  {
    name: 'Charlie Park',
    img: 'https://source.unsplash.com/1280x720/?park',
    description:
      'Donec id libero ut tellus efficitur rhoncus. Nam massa ipsum, pellentesque id pharetra aliquet, pulvinar sed sapien. Maecenas felis felis, vehicula et feugiat a, faucibus at felis. Maecenas in ex a lacus varius dapibus. Fusce scelerisque lorem eu diam egestas varius. Integer vehicula varius ex non vulputate. Donec tincidunt convallis lacus, nec aliquam massa porttitor ut. Fusce in ipsum quis mi varius viverra faucibus vitae ex. Phasellus sagittis turpis nec efficitur viverra. Nulla ut augue sed nibh cursus suscipit. Ut blandit aliquet turpis, eu lacinia dui sodales vitae.',
  },
];

module.exports = function seedDB() {
  // DELETE CAMPGROUNDS AND COMMENTS
  Comment.deleteMany({}, commentDelErr => {
    if (commentDelErr) {
      console.log(commentDelErr);
    } else {
      Campground.deleteMany({}, campgroundDelErr => {
        if (campgroundDelErr) {
          console.log(campgroundDelErr);
        } else {
          console.log('Removed Playgrounds and Comments');
          // ADD NEW CAMPGROUNDS
          campgroundData.forEach(campground => {
            Campground.create(campground, (addErr, addedCampground) => {
              if (addErr) {
                console.log(addErr);
              } else {
                console.log('Added a playground');
                // ADD COMMENTS
                Comment.create(
                  {
                    text: 'This Place is Amazing',
                    author: 'Homer',
                  },
                  (addCommentErr, addedComment) => {
                    if (addErr) {
                      console.log(addErr);
                    } else {
                      addedCampground.comments.push(addedComment);
                      addedCampground.save();
                      console.log('Added a comment');
                    }
                  },
                );
              }
            });
          });
        }
      });
    }
  });
};
