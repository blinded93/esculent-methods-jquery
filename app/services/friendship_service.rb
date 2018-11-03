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
    friendship = Friendship.new(self.instance_values)
    if self.request
      self.send_request(friendship)
    else
      self.send_response(friendship)
    end
  end

  def send_request(friendship)
    params = {
      sender_id:self.user_id,
      recipient_id:self.friend_id
    }
    message = MessageService.create_and_send("request", params)
  end

  def send_response(friendship)

  end
end
