(function($){

  
  // 500 EXIF plugin
  $.fn._500exif = function( options ){

    var _this = this,
    $element,
    parent = this.parent();

    _this.settings = $.extend({
      api_key    : 'a60e48077f9d11b6f856cc8a3dec4acd2b6cc508',
      selector   : 'img[data-photo-id]'
    }, options);

    if (!_500px.sdk_key) {
      _500px.init({
        sdk_key: _this.settings.api_key
      });
    }
    
    _this.metadata = [
      {
        key: 'camera',
        name: 'Camera'
      },
      {
        key: 'lens',
        name: 'Lens'
      },
      {
        key: 'focal_length',
        name: 'Focal Length',
        units: "mm"
      },
      {
        key: 'shutter_speed',
        name: 'Shutter Speed',
        units: "s"
      },
      {
        key: 'aperture',
        name: 'Aperture',
        prefix: 'f/'
      },
      {
        key: 'iso',
        name: 'ISO/Film'
      }
    ]

    _this.run = function(el) {
      $el = $(el);
      id = _this.getID($el);

      if ( !_this.checkLoaded($el) ){
        // _this.cleanUpPhoto($el);
        _this.getData(id, $el);
      } else {
        console.log('photo ' + id + ' already loaded.');
      }
    }


    _this.checkLoaded = function($el) {
      photo_id = $el.attr('data-photo-id');
      loaded_id = $el.attr('data-loaded-photo-id');
      console.log(photo_id, loaded_id);
      if( photo_id === loaded_id ){
        return true;
      } else {
        return false;
      }
    }

    _this.addLoadedID = function(id, $el) {
      $el.attr('data-loaded-photo-id', id);
    }

    _this.cleanUpPhoto = function($el) {
      var parent = $el.parents('.photo-with-exif');

      parent.find('.meta').remove();
      parent.find('figcaption').remove();
      $el.unwrap('.photo-wrapper');

    }

    _this.getID = function($el) {
      var photoID = $el.attr('data-photo-id');
      if( photoID && typeof photoID === 'string' || 'number' ){
        return photoID;
      } else {
        console.log('Photo does not have a properly formatted ID for looking up metadata.');
      }
    }

    _this.addTitle = function ( title, $el ) {
      $el.attr('alt', title);
    }

    _this.addCaption = function( desc, title, photoID, username, fullname, $el ) {
      var html = $('<figcaption><a href="#" class="info-button" title="info">i</span></figcaption>');

      if ( title.length > 0 ) {
        console.log(photoID);
        html.append('<h5 class="title"><a href="http://500px.com/photo/' + photoID + '" target="_blank">' + title + '</a></h5> by <h6><a href="http://500px.com/' + username + '">' + fullname + '</a></h6>');
      }

      if ( desc.length > 0 ) {
        html.append('<p>' + desc + '</p>');
      }


      html.find('.info-button').on('click', function (e) {
        e.preventDefault();
        $el.parent().toggleClass('show-exif');
      });

      $el.after(html);

    }

    




    _this.getData = function( photoID, $el ) {

      _500px.api('/photos/' + photoID, function (response) {
        if (response.success) {
          console.log(response.data.photo);
          _this.addTitle(response.data.photo.name, $el);
          _this.addCaption(response.data.photo.description, response.data.photo.name, photoID, response.data.photo.user.username, response.data.photo.user.fullname, $el);
          _this.createMeta(response.data.photo, $el);
          _this.addLoadedID(photoID, $el);
        }
      });

    }

    _this.createMeta = function ( data, $el ) {

      var el = $('<ul class="meta"></ul>'),
      html;

      $el.parent().addClass('photo-with-exif');
      $el.wrap('<div class="photo-wrapper" />');

      _this.metadata.forEach(function(dataType){
        var pre = dataType.prefix || '';
        var post = dataType.units || '';
        if (data[dataType['key']]) {
          html = '<li class="' + dataType.key + '"><span class="type">' + dataType.name + '</span>' + pre + data[dataType.key] + post +'</li>';
          el.append(html);
        }
      });

      $el.parents('.photo-wrapper').append(el);

    }


    // run all the functions to setup the metadata UI
    _this.each(function(index, el){
      _this.run(el);
    });

  }

})(jQuery);

