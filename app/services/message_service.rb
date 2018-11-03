class MessageService
  attr_accessor :subject, :body, :sender_id, :recipient_id

  def initialize(params)
    @subject = params[:subject]
    @body = params[:body]
    @sender_id = params[:sender_id]
    @recipient_id = params[:recipient_id]
  end

  def self.create(params, attr_method)
    self.new(params).tap do |message|
      message.send(attr_method).each do |attribute, value|
        message.send(attribute) = value
      end
    end
  end

  def self.create_and_send(type, params)
    message_attrs = self.create(params, "#{type}_params").instance_values
    message = Message.new(message_attrs)
  end

  private
    def request_params
      {
        subject: "You have a friend request!",
        user_id: self.recipient_id,
        body: ""
      }
    end

    def response_params
      {
        subject: "You have a new friend!",
        user_id: self.sender_id,
        body: ""
      }
    end

    def share_params
      {
        subject: "#{sender} shared a recipe with you!",
        recipe_id: recipe.id,
        body: ""
      }
    end

end
