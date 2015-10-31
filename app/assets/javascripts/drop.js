SoapStone.Drop = function(args) {
  if (args) {
    this.setAttributes(args);
  }
};

SoapStone.Drop.prototype.setAttributes = function(args) {
  this.id = args.id;
  if (args.coords) {
    this.coords = {};
    this.coords.longitude = args.coords.longitude;
    this.coords.latitude = args.coords.latitude;
  }
  if (args.lon && args.lat) {
    this.coords = {};
    this.coords.latitude = args.lat;
    this.coords.longitude = args.lon;
  }
  if (this.coords) {
    this.lat = this.coords.latitude;
    this.lon = this.coords.longitude;
  }
  this.text = args.text;
  this.photo = args.photo;
  this.created_at = args.created_at;
  this.snaps_count = args.snaps_count;
  this.comments_count = args.comments_count;
  this.snapped_by_you = args["snapped_by?"];
  if (args.user) {
    this.user = {};
    this.user.id = args.user.id;
    this.user.username = args.user.username;
    this.user.avatar = args.user.avatar;
  }
  if (args.comments) {
    this.comments = args.comments.map(function(data) {
      return new SoapStone.Comment(data);
    });
  }
  this.marker = new google.maps.Marker({
    position: new google.maps.LatLng(this.coords.latitude, this.coords.longitude),
  });
};

SoapStone.Drop.prototype.save = function() {
  var data = {};
  data.drop = {};
  for (var key in this) {
    if (this.hasOwnProperty(key)) {
      if (key !== 'marker') {
        data.drop[key] = this[key];
      }
    }
  }
  return $.ajax({
    type: "POST",
    url:  "/drops",
    data: data
  });
};

SoapStone.Drop.prototype.find = function(id) {
  var self = this;
  return new Promise(function(resolve, reject) {
    $.ajax({
      type: "GET",
      url: "/drops/" + id,
      dataType: 'json'
     })
    .then(function (response) {
      self.setAttributes(response);
      resolve(self);
    })
    .fail(function () {
      reject();
    });
  });
};

SoapStone.Comment = function(args) {
  this.text = args.text;
  if (args.user) {
    this.user = {};
    this.user.id = args.user.id;
    this.user.username = args.user.username;
    this.user.avatar = args.user.avatar;
  }
};


SoapStone.DropView = function() {
  var showTemplateSource   = $("[data-template='show-drop']").html();
  this.showTemplate = Handlebars.compile(showTemplateSource);
  this.setUpEventHandlers();
};

SoapStone.DropView.prototype.setUpEventHandlers = function(){
  $("[data-role='drop-form']").on('submit', function(event){
    event.preventDefault();
    var text = $(this).find("[name='text']").val();
    var photo = $(this).find("[name='photo']").val();
    $("#form-container").hide();
    SoapStone.app.createDrop({text: text, photo: photo});
  });
  
  $("[data-button='new-button']").on('click', function(event){
    $("[data-view='new-form']").show();
    $("[data-button='close-form']").on('click', function(event){
      event.preventDefault();
      $("[data-view='new-form']").hide();
    });
  });
};

SoapStone.DropView.prototype.showDrop = function(drop) {
  var self = this;
  $('body').append(this.showTemplate(drop));
  $("[data-view='map']").hide();
  $("[data-button='close-drop']").on('click', function (event) {
    self.closeDrop();
  });
};

SoapStone.DropView.prototype.closeDrop  = function() {
  $("[data-view='drop']").remove();
  $("[data-view='map']").show();
};

