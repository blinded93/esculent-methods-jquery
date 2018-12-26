class FriendshipService
  attr_accessor :friend_id, :user_id, :request, :type
  
  def initialize(params)
    @friend_id = params[:friend_id]
    @user_id = params[:user_id]
    @request = params[:request] == "true" ? true : false
  end

  def self.create(params)
    FriendshipService.new(params).parse
  end

  def parse
    friendship = Friendship.find_or_create_by(self.instance_values)
    send_correspondence(friendship)
    friendship
  end

  def send_correspondence(friendship)
    type = self.request ? "request" : "response"
    message = MessageService.create_and_send(type, self.params)
    fulfill_request() if type == "response"
  end

  def find_request
    Friendship.find_by({friend_id: self.user_id, user_id: self.friend_id})
  end

  def fulfill_request()
    find_request.tap do |f|
      f.request = false
      f.save
    end
  end

  def params
    { sender_id: self.user_id, recipient_id: self.friend_id }
  end
end
