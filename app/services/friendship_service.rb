class FriendshipService
  attr_accessor :friend_id, :user_id, :request
  def initialize(params)
    @friend_id = params[:friend_id]
    @user_id = params[:user_id]
    @request = params[:request]
  end

  def self.create(params)
    FriendshipService.new(params).parse
  end

  def parse
    friendship = Friendship.find_or_create_by(self.instance_values)
    send_correspondence(friendship)
  end

  def send_correspondence(friendship)
    type = self.request ? "request" : "response"
    params = self.send("#{type}_params")
    message = MessageService.create_and_send(type, params)
    friendship
  end

  def request_params
    {
      sender_id:self.user_id,
      recipient_id:self.friend_id
    }
  end

  def response_params
    {
      sender_id: self.friend_id,
      recipient_id: self.user_id
    }
  end
end
