$(document).ready(function(){
  function contactList(contact){
    var row = $('<tr>').attr('id', contact.id).html('<td>' + contact.id + '</td><td>' + contact.firstname + ' ' + contact.lastname + '</td><td>' + contact.email + '</td>')
    $(row).appendTo('.allContacts');
  };

  function phoneNumbersString(phones){
    var numbers = '';
    phones.forEach(function(value){
      numbers += value.number;
    });
    return numbers;
  };

  $.getJSON('/contacts', function(contacts) {
      contacts.forEach(contactList);
  });

 $(document).on('click', 'tr', function(){
    var id = $(this).children(":first").text();
    $('#editContactForm:not([hide])').addClass('hide');
    $.getJSON('/contact/' + id, {id: id}, function(contact) {
      console.log(contact)
      $('#contactName').text('Name: ' + contact['info'].firstname + ' ' + contact['info'].lastname);
      $('#contactEmail').text('Email: ' + contact['info'].email);
      $('#contactPhone').text('Phone(s): ' + phoneNumbersString(contact['phones']));
      $('#deleteContact').data('id', contact['info'].id);
      $('#contactDisplay').removeClass('hide');

      // $('#contactInfo').replaceWith(div);

      $('#deleteContact').on('click', function(){
        var id = $(this).data('id');
        $.post('/contact/destroy/' + id, {id: id}, function(result) {
          if (result){
            $('#' + id).remove();
            $('#contactDisplay').addClass('hide');
          };
        });
      });

      $('#manageContact').on('click', function(){
        $('#contactDisplay').addClass('hide');
        $('#cancelEditContact').on('click', function(){
          $('#editContactForm').addClass('hide');
          $('#contactDisplay').removeClass('hide');
        });

        $('#editContactForm').removeClass('hide');
        $('#editFirstName').val(contact['info'].firstname);
        $('#editLastName').val(contact['info'].lastname);
        $('#editEmail').val(contact['info'].email);

        $('#editContactForm').on('submit', function(e){
          e.preventDefault();
          var firstname = $('#editFirstName').val();
          var lastname = $('#editLastName').val();
          var email = $('#editEmail').val();
          $.post('/contact/update/' + id, {id: id, firstname: firstname, lastname: lastname, email: email}, function(updatedContact) {
            console.log(updatedContact);
            $('#editContactForm').addClass('hide');
            $('#contactName').text('Name: ' + updatedContact.firstname + ' ' + updatedContact.lastname);
            $('#contactEmail').text('Email: ' + updatedContact.email);
            $('#contactDisplay').removeClass('hide');
          });
        });
      });
    });
  });

  $('.newContact').on('click', function(){
    $('#newContactModal').modal('show');
  });

  $('#newContactForm').on('submit', function(e){
    e.preventDefault();
    var firstName = $('#inputFirstName').val();
    var lastName = $('#inputLastName').val();
    var email = $('#inputEmail').val();
    var phone = $('#inputPhone').val();

    $.ajax({
      url: '/contact/new',
      type: 'POST',
      data: {
        firstname: firstName,
        lastname: lastName,
        email: email,
        phone: phone
      }
    })
    .done(function(returnData) {
      console.log(returnData);
      $('#newContactForm')[0].reset();
      $('#newContactModal').modal('hide');
      contactList(returnData);
    })
    .fail(function() {
      console.log("error");
    });
  });
});

