class MessageService
  attr_accessor :subject, :body, :sender_id, :recipient_id, :user_id, :recipe_id

  def initialize(params)
    @subject = params[:subject]
    @body = params[:body]
    @sender_id = params[:sender_id]
    @recipient_id = params[:recipient_id]
    @recipe_id = params[:recipe_id] if params[:recipe_id]
  end

  def self.create_and_send(type, params)
    message = self.create(params, "#{type}_params")
    message.transmit(message.instance_values)
    message
  end

  def self.create(params, params_method)
    self.new(params).tap do |message|
      message.send(params_method).each do |attribute, value|
        message.send("#{attribute}=", value)
      end
    end
  end

  def transmit(message_attrs)
    message = Message.create(message_attrs)
  end

  def remove_request
    request_message_params = request_params.tap {|h| h[:user_id] = self.sender_id}
    Message.find_by(request_message_params).destroy
  end

  private
    def request_params
      { subject: "You have a friend request!", user_id: self.recipient_id }
    end

    def response_params
      { subject: "You have a new friend!", user_id: self.recipient_id }
    end

    def share_params
      user = User.find_by(id:self.sender_id)
      { subject: "#{user.username} shared a recipe with you!", recipe_id: self.recipe_id }
    end
end
